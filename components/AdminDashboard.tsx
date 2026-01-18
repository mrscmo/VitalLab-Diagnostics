import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Plus, Trash2, Edit2, LogOut, Settings, Save, Layout, Smartphone, 
  GripVertical, CheckCircle, Clock, XCircle, Image as ImageIcon, Type as TypeIcon, Globe, 
  Menu as MenuIcon, Upload, Link as LinkIcon, Move, ChevronDown, ChevronUp,
  Columns, Square, Heading, Minus, Hash, PaintBucket, Maximize,
  ArrowUp, ArrowDown
} from 'lucide-react';
import { LabTest, Appointment, TestCategory, WebsiteConfig, Page, MediaItem, MenuItem, Block, ElementType, ElementStyle } from '../types';
import { Header } from './Header';
import { Hero } from './Hero';
import { CustomPage } from './CustomPage';

interface AdminDashboardProps {
  tests: LabTest[];
  appointments: Appointment[];
  config: WebsiteConfig;
  onAddTest: (test: LabTest) => void;
  onUpdateTest: (test: LabTest) => void;
  onDeleteTest: (id: string) => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  onUpdateConfig: (config: WebsiteConfig) => void;
  onLogout: () => void;
}

// Recursively find a block and its parent
const findBlockAndParent = (blocks: Block[], id: string): { block: Block, parent: Block | null, index: number } | null => {
  if (!blocks) return null;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].id === id) {
      return { block: blocks[i], parent: null, index: i };
    }
    if (blocks[i].children) {
      const found = findBlockAndParent(blocks[i].children, id);
      if (found) {
        return found.parent ? found : { ...found, parent: blocks[i] };
      }
    }
  }
  return null;
};

// Recursively update a block
const updateBlockInTree = (blocks: Block[], id: string, updater: (b: Block) => Block): Block[] => {
  if (!blocks) return [];
  return blocks.map(b => {
    if (b.id === id) return updater(b);
    if (b.children) return { ...b, children: updateBlockInTree(b.children, id, updater) };
    return b;
  });
};

// Recursively delete a block
const deleteBlockFromTree = (blocks: Block[], id: string): Block[] => {
  if (!blocks) return [];
  return blocks.filter(b => b.id !== id).map(b => ({
    ...b,
    children: b.children ? deleteBlockFromTree(b.children, id) : undefined
  }));
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  tests, 
  appointments, 
  config: initialConfig,
  onAddTest, 
  onUpdateTest, 
  onDeleteTest,
  onUpdateAppointmentStatus,
  onUpdateConfig,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'appointments' | 'builder' | 'media' | 'menus'>('appointments');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Builder State
  const [activePanel, setActivePanel] = useState<'add' | 'style' | 'settings'>('add');
  const [builderSection, setBuilderSection] = useState<'pages' | 'theme' | 'settings'>('pages');
  const [configForm, setConfigForm] = useState<WebsiteConfig>(initialConfig);

  // Auto-switch to style panel when block selected
  useEffect(() => {
    if (selectedBlockId) setActivePanel('style');
    else setActivePanel('add');
  }, [selectedBlockId]);

  // --- Page Builder Logic ---
  const handleConfigChange = (newConfig: WebsiteConfig) => setConfigForm(newConfig);
  const handleSaveConfig = () => { onUpdateConfig(configForm); alert('Website published!'); };

  const handleAddPage = () => {
    const newPage: Page = {
      id: `p_${Date.now()}`,
      slug: `page-${Date.now()}`,
      title: 'New Page',
      type: 'custom',
      status: 'draft',
      blocks: []
    };
    handleConfigChange({ ...configForm, pages: [...configForm.pages, newPage] });
    setSelectedPageId(newPage.id);
  };

  const getSelectedPage = () => configForm.pages.find(p => p.id === selectedPageId);

  const handleAddElement = (type: ElementType, parentId?: string) => {
    const page = getSelectedPage();
    if (!page) return;

    const newBlock: Block = {
      id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      content: type === 'text' ? { html: '<p>Lorem ipsum dolor sit amet.</p>' } : 
               type === 'heading' ? { text: 'Heading Text' } :
               type === 'button' ? { text: 'Click Me', link: '#' } :
               type === 'image' ? { url: 'https://via.placeholder.com/600x400', caption: '' } :
               type === 'hero' ? { title: 'Hero Title', subtitle: 'Subtitle' } :
               type === 'stats' ? { number: '100%', label: 'Success Rate' } : {},
      styles: {
        paddingTop: type === 'section' ? '40' : '10',
        paddingBottom: type === 'section' ? '40' : '10',
        paddingLeft: '20',
        paddingRight: '20',
        width: type === 'column' ? '100%' : undefined,
        backgroundColor: type === 'section' ? '#ffffff' : undefined,
      },
      children: type === 'section' || type === 'column' ? [] : undefined
    };

    // If adding a Section, it goes to root
    if (type === 'section') {
       const updatedPages = configForm.pages.map(p => 
        p.id === selectedPageId ? { ...p, blocks: [...(p.blocks || []), newBlock] } : p
       );
       handleConfigChange({ ...configForm, pages: updatedPages });
       return;
    }

    // If we have a selected block that is a container (Column), add inside
    // If we have a selected block that is NOT a container, add after it in parent
    let targetId = parentId || selectedBlockId;
    
    // Safety: If nothing selected, find last section or create one?
    if (!targetId && page.blocks && page.blocks.length > 0) {
       alert("Please select a Column or Section to add this widget into.");
       return;
    } else if (!targetId) {
       alert("Add a Section first.");
       return;
    }

    const updatedPages = configForm.pages.map(p => {
      if (p.id !== selectedPageId) return p;
      
      // Find target
      const target = findBlockAndParent(p.blocks || [], targetId!);
      if (!target) return p;

      let newBlocks = [...(p.blocks || [])];

      if (target.block.type === 'column' || target.block.type === 'section') {
         // Add as child
         newBlocks = updateBlockInTree(newBlocks, targetId!, (b) => ({
             ...b,
             children: [...(b.children || []), newBlock]
         }));
      } else {
         // It's a widget, find parent and add sibling
         if (target.parent) {
             newBlocks = updateBlockInTree(newBlocks, target.parent.id, (parent) => {
                 const newChildren = [...(parent.children || [])];
                 newChildren.splice(target.index + 1, 0, newBlock);
                 return { ...parent, children: newChildren };
             });
         }
      }
      return { ...p, blocks: newBlocks };
    });

    handleConfigChange({ ...configForm, pages: updatedPages });
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlockStyle = (id: string, styleUpdate: Partial<ElementStyle>) => {
     const updatedPages = configForm.pages.map(p => {
        if (p.id !== selectedPageId) return p;
        return {
            ...p,
            blocks: updateBlockInTree(p.blocks || [], id, (b) => ({
                ...b,
                styles: { ...b.styles, ...styleUpdate }
            }))
        };
     });
     handleConfigChange({ ...configForm, pages: updatedPages });
  };

  const handleUpdateBlockContent = (id: string, contentUpdate: any) => {
     const updatedPages = configForm.pages.map(p => {
        if (p.id !== selectedPageId) return p;
        return {
            ...p,
            blocks: updateBlockInTree(p.blocks || [], id, (b) => ({
                ...b,
                content: { ...b.content, ...contentUpdate }
            }))
        };
     });
     handleConfigChange({ ...configForm, pages: updatedPages });
  };

  const handleDeleteBlock = (id: string) => {
      if (!confirm("Delete this element?")) return;
      const updatedPages = configForm.pages.map(p => {
          if (p.id !== selectedPageId) return p;
          return { ...p, blocks: deleteBlockFromTree(p.blocks || [], id) };
      });
      handleConfigChange({ ...configForm, pages: updatedPages });
      setSelectedBlockId(null);
  };

  const getSelectedBlock = () => {
      if (!selectedPageId || !selectedBlockId) return null;
      const page = configForm.pages.find(p => p.id === selectedPageId);
      if (!page) return null;
      const found = findBlockAndParent(page.blocks || [], selectedBlockId);
      return found ? found.block : null;
  };

  const selectedBlock = getSelectedBlock();

  // --- Render Helpers ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white shadow-md z-50 h-14 flex-shrink-0 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
             <div className="bg-medical-500 p-1 rounded">
               <FileText size={18} className="text-white"/>
             </div>
             <span className="font-bold text-lg tracking-tight">VitalLab <span className="text-slate-400 font-normal">Builder</span></span>
          </div>
          <div className="flex items-center space-x-4">
             {activeTab === 'builder' && (
                 <div className="flex bg-slate-800 rounded p-1 space-x-1">
                     <button onClick={() => setBuilderSection('pages')} className={`px-3 py-1 text-xs rounded ${builderSection === 'pages' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}>Pages</button>
                     <button onClick={() => setBuilderSection('theme')} className={`px-3 py-1 text-xs rounded ${builderSection === 'theme' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}>Global Theme</button>
                 </div>
             )}
            <button onClick={onLogout} className="flex items-center text-slate-300 hover:text-white text-xs">
              <LogOut size={14} className="mr-1" /> Logout
            </button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Pages & Elements */}
        {activeTab === 'builder' && (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-20 shadow-lg">
             {builderSection === 'pages' && (
                 <>
                    <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                        <span className="font-bold text-sm text-slate-700">Pages</span>
                        <button onClick={handleAddPage} className="bg-medical-50 text-medical-600 p-1 rounded hover:bg-medical-100"><Plus size={16}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {configForm.pages.map(p => (
                            <div 
                            key={p.id} 
                            onClick={() => { setSelectedPageId(p.id); setSelectedBlockId(null); }}
                            className={`px-4 py-3 cursor-pointer text-sm flex justify-between items-center border-b border-slate-50 ${selectedPageId === p.id ? 'bg-medical-50 text-medical-700 font-medium border-l-4 border-l-medical-600' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                {p.title}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.type === 'system' ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>{p.type}</span>
                            </div>
                        ))}
                    </div>
                 </>
             )}
             
             {builderSection === 'theme' && (
                 <div className="p-4 space-y-6">
                    <div>
                       <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Global Colors</h3>
                       <div className="space-y-3">
                          <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Primary Color</label>
                             <div className="flex items-center space-x-2">
                                <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 p-0" value={configForm.theme.colors.primary} onChange={e => handleConfigChange({...configForm, theme: {...configForm.theme, colors: {...configForm.theme.colors, primary: e.target.value}}})} />
                                <span className="text-xs text-slate-500">{configForm.theme.colors.primary}</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-1">Affects buttons, headers, links</p>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Color</label>
                             <div className="flex items-center space-x-2">
                                <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 p-0" value={configForm.theme.colors.secondary} onChange={e => handleConfigChange({...configForm, theme: {...configForm.theme, colors: {...configForm.theme.colors, secondary: e.target.value}}})} />
                                <span className="text-xs text-slate-500">{configForm.theme.colors.secondary}</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-1">Affects footers, dark text</p>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Accent Color</label>
                             <div className="flex items-center space-x-2">
                                <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 p-0" value={configForm.theme.colors.accent} onChange={e => handleConfigChange({...configForm, theme: {...configForm.theme, colors: {...configForm.theme.colors, accent: e.target.value}}})} />
                                <span className="text-xs text-slate-500">{configForm.theme.colors.accent}</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-1">Affects highlights, icons</p>
                          </div>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Typography</h3>
                       <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Font Family</label>
                          <select 
                            className="w-full border p-2 rounded text-sm bg-white"
                            value={configForm.theme.font}
                            onChange={e => handleConfigChange({...configForm, theme: {...configForm.theme, font: e.target.value}})}
                          >
                             {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Playfair Display'].map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                       </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Layout</h3>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Border Radius</label>
                        <select 
                        className="w-full border p-2 rounded text-sm bg-white"
                        value={configForm.theme.borderRadius}
                        onChange={e => handleConfigChange({...configForm, theme: {...configForm.theme, borderRadius: e.target.value as any}})}
                        >
                            <option value="none">None</option>
                            <option value="sm">Small</option>
                            <option value="md">Medium</option>
                            <option value="lg">Large</option>
                        </select>
                    </div>
                 </div>
             )}
             
             {builderSection === 'pages' && selectedPageId && (
                <div className="flex-1 flex flex-col border-t-4 border-slate-100">
                    <div className="flex border-b bg-slate-50">
                        <button onClick={() => setActivePanel('add')} className={`flex-1 py-2 text-xs font-bold ${activePanel === 'add' ? 'text-medical-600 border-b-2 border-medical-600 bg-white' : 'text-slate-500'}`}>Add</button>
                        <button onClick={() => setActivePanel('style')} disabled={!selectedBlockId} className={`flex-1 py-2 text-xs font-bold ${activePanel === 'style' ? 'text-medical-600 border-b-2 border-medical-600 bg-white' : 'text-slate-400'}`}>Edit</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                        {activePanel === 'add' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Layout</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => handleAddElement('section')} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded hover:border-medical-500 hover:shadow transition-all group">
                                            <Layout size={20} className="text-slate-500 group-hover:text-medical-600 mb-1"/>
                                            <span className="text-[10px] text-slate-600">Section</span>
                                        </button>
                                        <button onClick={() => handleAddElement('column')} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded hover:border-medical-500 hover:shadow transition-all group">
                                            <Columns size={20} className="text-slate-500 group-hover:text-medical-600 mb-1"/>
                                            <span className="text-[10px] text-slate-600">Column</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Basic</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => handleAddElement('heading')} className="widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><Heading size={14} className="mr-2"/> Heading</button>
                                        <button onClick={() => handleAddElement('text')} className="widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><TypeIcon size={14} className="mr-2"/> Text</button>
                                        <button onClick={() => handleAddElement('image')} className="widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><ImageIcon size={14} className="mr-2"/> Image</button>
                                        <button onClick={() => handleAddElement('button')} className="widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><Square size={14} className="mr-2"/> Button</button>
                                        <button onClick={() => handleAddElement('divider')} className="widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><Minus size={14} className="mr-2"/> Divider</button>
                                        <button onClick={() => handleAddElement('stats')} className="widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><Hash size={14} className="mr-2"/> Stats</button>
                                        <button onClick={() => handleAddElement('hero')} className="col-span-2 widget-btn bg-white border p-2 rounded flex items-center text-xs hover:border-medical-500"><Maximize size={14} className="mr-2"/> Hero Section</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePanel === 'style' && selectedBlock && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-xs font-bold uppercase text-slate-500">{selectedBlock.type}</span>
                                    <button onClick={() => handleDeleteBlock(selectedBlock.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                                </div>

                                {/* Content Editor */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-slate-700">Content</h5>
                                    {selectedBlock.type === 'heading' && (
                                        <input className="input-field" value={selectedBlock.content.text} onChange={e => handleUpdateBlockContent(selectedBlock.id, {text: e.target.value})} />
                                    )}
                                    {selectedBlock.type === 'text' && (
                                        <textarea className="input-field h-24" value={selectedBlock.content.html} onChange={e => handleUpdateBlockContent(selectedBlock.id, {html: e.target.value})} />
                                    )}
                                    {selectedBlock.type === 'image' && (
                                        <>
                                            <input className="input-field" placeholder="URL" value={selectedBlock.content.url} onChange={e => handleUpdateBlockContent(selectedBlock.id, {url: e.target.value})} />
                                            <input className="input-field" placeholder="Caption" value={selectedBlock.content.caption} onChange={e => handleUpdateBlockContent(selectedBlock.id, {caption: e.target.value})} />
                                        </>
                                    )}
                                    {selectedBlock.type === 'button' && (
                                        <>
                                            <input className="input-field" placeholder="Label" value={selectedBlock.content.text} onChange={e => handleUpdateBlockContent(selectedBlock.id, {text: e.target.value})} />
                                            <input className="input-field" placeholder="Link" value={selectedBlock.content.link} onChange={e => handleUpdateBlockContent(selectedBlock.id, {link: e.target.value})} />
                                        </>
                                    )}
                                    {selectedBlock.type === 'stats' && (
                                        <>
                                            <input className="input-field" placeholder="Number (e.g. 100%)" value={selectedBlock.content.number} onChange={e => handleUpdateBlockContent(selectedBlock.id, {number: e.target.value})} />
                                            <input className="input-field" placeholder="Label" value={selectedBlock.content.label} onChange={e => handleUpdateBlockContent(selectedBlock.id, {label: e.target.value})} />
                                        </>
                                    )}
                                </div>

                                <hr className="border-slate-200"/>

                                {/* Style Editor */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-slate-700 flex items-center"><PaintBucket size={12} className="mr-1"/> Styles</h5>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="label-text">Bg Color</label>
                                            <input type="color" className="w-full h-8 rounded cursor-pointer" value={selectedBlock.styles.backgroundColor || '#ffffff'} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {backgroundColor: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="label-text">Text Color</label>
                                            <input type="color" className="w-full h-8 rounded cursor-pointer" value={selectedBlock.styles.color || '#000000'} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {color: e.target.value})} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label-text">Padding (px)</label>
                                        <div className="grid grid-cols-4 gap-1">
                                            <input placeholder="T" className="input-xs" value={selectedBlock.styles.paddingTop} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {paddingTop: e.target.value})} />
                                            <input placeholder="R" className="input-xs" value={selectedBlock.styles.paddingRight} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {paddingRight: e.target.value})} />
                                            <input placeholder="B" className="input-xs" value={selectedBlock.styles.paddingBottom} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {paddingBottom: e.target.value})} />
                                            <input placeholder="L" className="input-xs" value={selectedBlock.styles.paddingLeft} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {paddingLeft: e.target.value})} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label-text">Align</label>
                                        <div className="flex bg-white border rounded">
                                            {['left', 'center', 'right', 'justify'].map(a => (
                                                <button key={a} onClick={() => handleUpdateBlockStyle(selectedBlock.id, {textAlign: a as any})} className={`flex-1 p-1 text-[10px] uppercase ${selectedBlock.styles.textAlign === a ? 'bg-medical-50 text-medical-600' : ''}`}>{a[0]}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedBlock.type === 'column' && (
                                        <div>
                                            <label className="label-text">Width</label>
                                            <select className="input-field" value={selectedBlock.styles.width || '100%'} onChange={e => handleUpdateBlockStyle(selectedBlock.id, {width: e.target.value})}>
                                                <option value="100%">100%</option>
                                                <option value="50%">50% (1/2)</option>
                                                <option value="33.33%">33% (1/3)</option>
                                                <option value="25%">25% (1/4)</option>
                                                <option value="66.66%">66% (2/3)</option>
                                            </select>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                </div>
             )}
        </div>
        )}

        {/* Center: Canvas */}
        <div className="flex-1 bg-slate-200 flex flex-col h-full overflow-hidden relative">
           {activeTab === 'builder' ? (
                selectedPageId ? (
                   <div className="flex-1 overflow-y-auto p-8 perspective-1000">
                      <div className="flex justify-between items-center mb-4 max-w-5xl mx-auto">
                         <div className="text-xs text-slate-500">Editing: <b>{configForm.pages.find(p => p.id === selectedPageId)?.title}</b></div>
                         <div className="flex space-x-2">
                             <button onClick={() => {}} className="bg-white p-2 rounded shadow text-slate-600 hover:text-blue-600"><Smartphone size={16}/></button>
                             <button onClick={handleSaveConfig} className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm font-medium hover:bg-green-700 flex items-center"><Save size={14} className="mr-2"/> Publish</button>
                         </div>
                      </div>
                      
                      <div className="bg-white min-h-[800px] shadow-2xl max-w-5xl mx-auto rounded overflow-hidden flex flex-col transition-all duration-300 transform" onClick={() => setSelectedBlockId(null)}>
                         <div className="pointer-events-none opacity-50 border-b">
                            <Header currentPage="home" onNavigate={() => {}} config={configForm} />
                         </div>
                         
                         <div className="flex-1 relative pb-12">
                             {/* Render the CustomPage in "Editor Mode" */}
                             {getSelectedPage() && (
                                 <CustomPage 
                                    page={getSelectedPage()!} 
                                    onNavigate={() => {}} 
                                    isEditorMode={true}
                                    selectedBlockId={selectedBlockId}
                                    onSelectBlock={(id, e) => {
                                        setSelectedBlockId(id);
                                    }}
                                 />
                             )}
                             {(!getSelectedPage()?.blocks || getSelectedPage()?.blocks?.length === 0) && (
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="text-center text-slate-400">
                                         <Plus size={48} className="mx-auto mb-2 opacity-20"/>
                                         <p>Add a Section to start building</p>
                                     </div>
                                 </div>
                             )}
                         </div>
                      </div>
                   </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Select a page from the sidebar</div>
                )
           ) : (
             <div className="p-12 text-center text-slate-500">
                 Appointments & Test Management (Placeholder for existing views)
             </div>
           )}
        </div>

      </div>
      
      <style>{`
        .widget-btn { transition: all 0.2s; cursor: pointer; }
        .widget-btn:hover { background-color: #f8fafc; transform: translateY(-1px); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .input-field { width: 100%; border: 1px solid #cbd5e1; padding: 6px; border-radius: 4px; font-size: 12px; }
        .input-xs { width: 100%; border: 1px solid #cbd5e1; padding: 2px 4px; border-radius: 3px; font-size: 10px; text-align: center; }
        .label-text { display: block; font-size: 10px; font-weight: 600; color: #64748b; margin-bottom: 2px; text-transform: uppercase; }
      `}</style>
    </div>
  );
};