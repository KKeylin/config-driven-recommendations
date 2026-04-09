export interface TestimonialConfig {
  author: Person;
  testimonials: Testimonial[];
  theme?: ThemeConfig;
}

export interface Person {
  name?: string;
  title?: string;
  summary?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  links?: { label: string; url: string }[];
  currentRole?: {
    title: string;
    company: string;
  };
}

export type TestimonialSource =
  | { type: 'linkedin'; url: string }
  | { type: 'reference-letter'; available: true }
  | { type: 'verbal'; contactAvailable?: boolean };

export interface Testimonial {
  id: string;
  author: Person;                  // who wrote the recommendation
  text: string;
  relationship: string;            // e.g. "Managed Kostya at RBC"
  date: string;
  source: TestimonialSource;
  recommendationUrl?: string;      // direct link to given-recommendations on author's profile (if public)
  associatedRole: {                // which job this relates to
    company: string;
    period: string;
    type: AssociatedRoleType;
    project?: string;              // specific product/team within the company
  };
  weight?: EndorsementWeight;      // seniority signal
}
export interface EndorsementWeight {
  level: 'report' | 'mentee' | 'colleague' | 'lead' | 'manager' | 'director' | 'vp' | 'c-level';
  yearsExperience?: number;
}

export type AssociatedRoleType = 'employment' | 'contract' | 'education' | 'side-project';

export interface ThemeConfig {
  variant: 'cards' | 'timeline' | 'masonry';
  colorScheme?: 'light' | 'dark' | 'auto';
  accentColor?: string;
  showHeader?: boolean;
  timeline?: {
    groupBy?: 'type' | 'company';
    include?: AssociatedRoleType[];
  };
}
