import { LabTest, TestCategory, WebsiteConfig } from '../types';

export const INITIAL_TESTS: LabTest[] = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    category: TestCategory.BLOOD,
    price: 25,
    description: 'Measures several components and features of your blood, including red blood cells, white blood cells, and platelets.',
    turnaroundTime: '24 Hours'
  },
  {
    id: 't2',
    name: 'Lipid Panel',
    category: TestCategory.BLOOD,
    price: 45,
    description: 'Measures the amount of cholesterol and triglycerides in your blood. Fasting required.',
    turnaroundTime: '24 Hours'
  },
  {
    id: 't3',
    name: 'Comprehensive Metabolic Panel (CMP)',
    category: TestCategory.BLOOD,
    price: 55,
    description: 'Measures 14 different substances in your blood, providing important information about your body\'s chemical balance and metabolism.',
    turnaroundTime: '24-48 Hours'
  },
  {
    id: 't4',
    name: 'Urinalysis, Complete',
    category: TestCategory.URINE,
    price: 30,
    description: 'A test of your urine. It\'s used to detect and manage a wide range of disorders, such as urinary tract infections, kidney disease and diabetes.',
    turnaroundTime: '24 Hours'
  },
  {
    id: 't5',
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: TestCategory.BLOOD,
    price: 40,
    description: 'Screening test for thyroid function.',
    turnaroundTime: '24 Hours'
  },
  {
    id: 't6',
    name: 'Vitamin D, 25-Hydroxy',
    category: TestCategory.BLOOD,
    price: 60,
    description: 'Measures the level of vitamin D in your blood.',
    turnaroundTime: '48 Hours'
  },
  {
    id: 't7',
    name: 'Hemoglobin A1c',
    category: TestCategory.BLOOD,
    price: 35,
    description: 'Measures your average blood sugar levels over the past 3 months.',
    turnaroundTime: '24 Hours'
  },
  {
    id: 't8',
    name: 'X-Ray Chest PA View',
    category: TestCategory.IMAGING,
    price: 75,
    description: 'Standard chest radiograph.',
    turnaroundTime: 'Immediate'
  }
];

export const INITIAL_CONFIG: WebsiteConfig = {
  companyName: "VitalLab",
  companyTagline: "Medical Diagnostics",
  theme: {
    font: "Inter",
    colors: {
        primary: "#0284c7", // medical-600 default (Sky Blue)
        secondary: "#0f172a", // slate-900 default (Dark Slate)
        accent: "#14b8a6" // teal-500 default (Teal)
    },
    borderRadius: 'md'
  },
  mediaLibrary: [
    { id: 'm1', name: 'Lab Scientist', type: 'image', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { id: 'm2', name: 'Microscope', type: 'image', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { id: 'm3', name: 'Test Tubes', type: 'image', url: 'https://images.unsplash.com/photo-1530482054429-cc491f61333b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  ],
  menus: {
    header: [
      { id: 'nav1', label: 'Home', link: 'home' },
      { id: 'nav2', label: 'Tests', link: 'catalog' },
      { id: 'nav3', label: 'About Us', link: 'about' },
      { id: 'nav4', label: 'AI Helper', link: 'assistant' },
    ],
    footer: [
      { id: 'f1', label: 'Privacy Policy', link: 'privacy' },
      { id: 'f2', label: 'Terms of Service', link: 'terms' },
    ]
  },
  pages: [
    { id: 'home', slug: 'home', title: 'Home', type: 'system', status: 'published' },
    { id: 'catalog', slug: 'catalog', title: 'Test Catalog', type: 'system', status: 'published' },
    { id: 'appointment', slug: 'appointment', title: 'Book Appointment', type: 'system', status: 'published' },
    { id: 'assistant', slug: 'assistant', title: 'AI Assistant', type: 'system', status: 'published' },
    { 
      id: 'about', 
      slug: 'about', 
      title: 'About Us', 
      type: 'custom', 
      status: 'published',
      blocks: [
        {
          id: 'b1',
          type: 'hero',
          content: {
            title: 'Dedicated to Precision',
            subtitle: 'About VitalLab',
          },
          styles: {
            color: '#ffffff',
            backgroundImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            textAlign: 'center',
            minHeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        {
          id: 'b2',
          type: 'text',
          content: {
            html: '<h2 class="text-2xl font-bold mb-4">Our History</h2><p>Founded in 2010, VitalLab has been committed to providing high-quality diagnostic services to our community. Our mission is to empower patients with accurate health data through state-of-the-art technology and compassionate care.</p>'
          },
          styles: {
            paddingTop: '40',
            paddingBottom: '20',
            paddingLeft: '20',
            paddingRight: '20'
          }
        },
        {
          id: 'b3',
          type: 'section',
          content: {},
          styles: {
            backgroundColor: '#f1f5f9',
            paddingTop: '40',
            paddingBottom: '40'
          },
          children: [
            {
              id: 'b3-1',
              type: 'text',
              content: { html: '<h3 class="text-xl font-bold text-center">Accredited by ISO 15189</h3><p class="text-center">We adhere to the highest international standards of laboratory practice.</p>' },
              styles: { paddingLeft: '20', paddingRight: '20' }
            }
          ]
        },
        {
          id: 'b4',
          type: 'button',
          content: {
            text: 'View Our Services',
            link: 'catalog',
          },
          styles: {
            textAlign: 'center',
            paddingTop: '20',
            paddingBottom: '40',
            backgroundColor: '#0284c7',
            color: '#ffffff'
          }
        }
      ]
    }
  ],
  contact: {
    email: "support@vitallab.com",
    phone: "(555) 123-4567",
    address: "123 Wellness Ave, Health City",
    hours: "Mon-Fri: 7AM - 6PM, Sat: 8AM - 2PM"
  },
  hero: {
    titlePrefix: "Advanced diagnostics for",
    titleHighlight: "a healthier tomorrow",
    description: "VitalLab provides fast, accurate, and comprehensive laboratory testing services. From routine blood work to complex genetic analysis, trust us with your health data.",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  features: [
    {
      title: "Accurate Results",
      description: "ISO 15189 certified laboratory utilizing state-of-the-art analyzers."
    },
    {
      title: "Fast Turnaround",
      description: "Most routine test results are available online within 24 hours."
    },
    {
      title: "Comprehensive Care",
      description: "Over 2,000 specialized tests available for precise diagnosis."
    }
  ]
};