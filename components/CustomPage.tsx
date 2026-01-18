import React from 'react';
import { Page, Block, ElementStyle } from '../types';

interface CustomPageProps {
  page: Page;
  onNavigate?: (path: string) => void;
  isEditorMode?: boolean;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string, e: React.MouseEvent) => void;
}

const mapStyles = (styles: ElementStyle = {}): React.CSSProperties => {
  const css: React.CSSProperties = {
    paddingTop: styles.paddingTop ? `${styles.paddingTop}px` : undefined,
    paddingBottom: styles.paddingBottom ? `${styles.paddingBottom}px` : undefined,
    paddingLeft: styles.paddingLeft ? `${styles.paddingLeft}px` : undefined,
    paddingRight: styles.paddingRight ? `${styles.paddingRight}px` : undefined,
    marginTop: styles.marginTop ? `${styles.marginTop}px` : undefined,
    marginBottom: styles.marginBottom ? `${styles.marginBottom}px` : undefined,
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    borderRadius: styles.borderRadius === 'none' ? '0' : styles.borderRadius === 'sm' ? '0.125rem' : styles.borderRadius === 'md' ? '0.375rem' : styles.borderRadius === 'lg' ? '0.5rem' : styles.borderRadius,
    borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
    borderColor: styles.borderColor,
    boxShadow: styles.boxShadow,
    fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
    fontWeight: styles.fontWeight,
    textAlign: styles.textAlign,
    width: styles.width,
    minHeight: styles.minHeight ? `${styles.minHeight}px` : undefined,
    display: styles.display,
    justifyContent: styles.justifyContent,
    alignItems: styles.alignItems,
  };

  if (styles.backgroundImage) {
      css.backgroundImage = `url(${styles.backgroundImage})`;
      css.backgroundSize = 'cover';
      css.backgroundPosition = 'center';
  }

  return css;
};

interface BlockRendererProps {
  block: Block;
  onNavigate?: (path: string) => void;
  isEditorMode?: boolean;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string, e: React.MouseEvent) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  onNavigate, 
  isEditorMode, 
  selectedBlockId, 
  onSelectBlock 
}) => {
  if (!block) return null;

  // Ensure styles object exists
  const style = mapStyles(block.styles || {});
  
  const handleBlockClick = (e: React.MouseEvent) => {
    if (isEditorMode && onSelectBlock) {
      e.stopPropagation(); // Prevent bubbling to parent blocks
      onSelectBlock(block.id, e);
    }
  };

  const isSelected = selectedBlockId === block.id;
  const editorClass = isEditorMode 
    ? `cursor-pointer transition-all border-2 ${isSelected ? 'border-medical-600 shadow-lg z-10' : 'border-transparent hover:border-medical-300 border-dashed hover:border-solid'}`
    : '';

  // Content Rendering Logic
  const renderInner = () => {
      switch (block.type) {
        case 'section':
             // Check if children contain columns to determine layout direction default
             const hasColumns = block.children?.some(c => c.type === 'column') || false;
             // If display is not explicitly set in styles, and we have columns, default to flex row
             const defaultFlex = (hasColumns && !style.display) ? 'flex flex-wrap' : '';
             
             return (
                 <div className={`w-full max-w-7xl mx-auto ${defaultFlex}`}>
                    {block.children?.map(child => (
                        <BlockRenderer 
                            key={child.id} 
                            block={child} 
                            onNavigate={onNavigate}
                            isEditorMode={isEditorMode}
                            selectedBlockId={selectedBlockId}
                            onSelectBlock={onSelectBlock}
                        />
                    ))}
                    {(!block.children || block.children.length === 0) && isEditorMode && (
                        <div className="w-full py-8 text-center text-slate-300 text-sm border-2 border-dashed border-slate-200 bg-slate-50">
                            Empty Section (Add Columns or Widgets)
                        </div>
                    )}
                 </div>
             );
        case 'column':
             return (
                 <>
                    {block.children?.map(child => (
                        <BlockRenderer 
                            key={child.id} 
                            block={child} 
                            onNavigate={onNavigate}
                            isEditorMode={isEditorMode}
                            selectedBlockId={selectedBlockId}
                            onSelectBlock={onSelectBlock}
                        />
                    ))}
                    {(!block.children || block.children.length === 0) && isEditorMode && (
                        <div className="p-4 text-center text-slate-300 text-xs border border-dashed border-slate-200">
                            Empty Column
                        </div>
                    )}
                 </>
             );
        case 'hero':
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{block.content?.title || 'Hero Title'}</h1>
                    <p className="text-xl mb-6 opacity-90">{block.content?.subtitle || 'Hero Subtitle'}</p>
                </div>
            );
        case 'text':
             return <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: block.content?.html || '' }} />;
        case 'heading':
             return <h2 className="text-3xl font-bold text-slate-900">{block.content?.text || 'Heading'}</h2>;
        case 'image':
             return (
                 <div className="flex flex-col items-center w-full">
                    {block.content?.url ? (
                        <img src={block.content.url} alt={block.content.caption || 'Image'} className="max-w-full h-auto rounded shadow-sm" />
                    ) : <div className="bg-slate-200 h-48 w-full flex items-center justify-center text-slate-400">Image Placeholder</div>}
                    {block.content?.caption && <span className="text-sm text-slate-500 mt-2">{block.content.caption}</span>}
                 </div>
             );
        case 'button':
             return (
                 <button 
                    onClick={(e) => {
                        if (isEditorMode) e.preventDefault();
                        else if (onNavigate) onNavigate(block.content?.link || '#');
                    }}
                    className="inline-block px-6 py-3 bg-medical-600 text-white rounded-md font-medium hover:bg-medical-700 transition-colors shadow-sm"
                 >
                     {block.content?.text || 'Button'}
                 </button>
             );
        case 'divider':
             return <hr className="border-slate-200 my-4 w-full"/>;
        case 'stats':
             return (
                 <div className="text-center p-4">
                     <div className="text-4xl font-bold text-medical-600 mb-1">{block.content?.number || '0'}</div>
                     <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{block.content?.label || 'Label'}</div>
                 </div>
             );
        default:
            return <div className="text-red-500 text-xs p-2">Unknown block type: {block.type}</div>;
      }
  };

  return (
    <div 
        id={block.id}
        className={`${editorClass} relative`}
        style={style}
        onClick={handleBlockClick}
    >
        {isEditorMode && isSelected && (
            <div className="absolute top-0 left-0 -mt-5 bg-medical-600 text-white text-[10px] px-2 py-0.5 rounded-t z-20 uppercase font-bold tracking-wider">
                {block.type}
            </div>
        )}
        {renderInner()}
    </div>
  );
};

export const CustomPage: React.FC<CustomPageProps> = ({ 
  page, 
  onNavigate, 
  isEditorMode = false,
  selectedBlockId = null,
  onSelectBlock
}) => {
  return (
    <div className={`bg-slate-50 min-h-screen ${isEditorMode ? 'pb-24' : ''}`}>
      {/* Fallback for legacy pages without blocks */}
      {(!page.blocks || page.blocks.length === 0) && page.legacyContent ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 my-12">
          <div className="bg-medical-700 py-8 px-8">
            <h1 className="text-3xl font-bold text-white">{page.title}</h1>
          </div>
          <div className="p-8 prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page.legacyContent }} />
          </div>
        </div>
      ) : (
        // Render Block Structure
        <div className="w-full flex flex-col items-center">
          {page.blocks?.map(block => (
            <BlockRenderer 
                key={block.id} 
                block={block} 
                onNavigate={onNavigate}
                isEditorMode={isEditorMode}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
};