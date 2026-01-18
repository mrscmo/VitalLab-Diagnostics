export interface LabTest {
  id: string;
  name: string;
  category: TestCategory;
  price: number;
  description: string;
  turnaroundTime: string;
}

export enum TestCategory {
  BLOOD = 'Blood Test',
  URINE = 'Urine Analysis',
  GENETIC = 'Genetic Testing',
  PATHOLOGY = 'Pathology',
  IMAGING = 'Imaging'
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  date: string;
  time: string;
  testId: string;
  testName?: string; // Derived for display
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// --- CMS Core Types ---

export type ElementType = 'section' | 'column' | 'heading' | 'text' | 'image' | 'button' | 'hero' | 'divider' | 'stats';

export interface ElementStyle {
  // Spacing
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  
  // Appearance
  backgroundColor?: string;
  backgroundImage?: string;
  color?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  boxShadow?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Layout
  width?: string; // primarily for columns (e.g., '50%', '100%')
  minHeight?: string;
  display?: string;
  justifyContent?: string;
  alignItems?: string;
}

export interface Block {
  id: string;
  type: ElementType;
  content: any; // content specific data (text, url, etc)
  styles: ElementStyle;
  children?: Block[]; // Recursive structure for Sections -> Columns -> Widgets
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  link: string; // slug or external url
  children?: MenuItem[];
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  type: 'system' | 'custom';
  status: 'draft' | 'published';
  blocks?: Block[]; 
  legacyContent?: string;
}

export interface WebsiteConfig {
  companyName: string;
  companyTagline: string;
  theme: {
    font: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    borderRadius: 'none' | 'sm' | 'md' | 'lg';
  };
  pages: Page[];
  mediaLibrary: MediaItem[];
  menus: {
    header: MenuItem[];
    footer: MenuItem[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    imageUrl: string;
  };
  features: {
    title: string;
    description: string;
  }[];
}