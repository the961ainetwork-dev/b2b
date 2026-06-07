export interface FilterState {
  industry: string;
  geography: string;
  jobLevel: string;
  companySize: string;
}

export interface ContactRecord {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  size: string;
  country: string;
  industry: string;
  revenue: string;
  linkedin: string;
  verifiedStatus: 'Verified' | '98% Deliverability';
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  benefits: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
