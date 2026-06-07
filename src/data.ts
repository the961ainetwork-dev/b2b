import { ContactRecord, ServiceItem, TestimonialItem, FAQItem } from './types';

export const INDUSTRIES = [
  'Technology & SaaS',
  'Healthcare & Life Sciences',
  'Construction & Engineering',
  'Finance & Banking',
  'Manufacturing',
  'HVAC & Energy Services',
  'Real Estate & Brokerage',
  'Retail & E-commerce',
  'Logistics & Supply Chain'
];

export const GEOGRAPHIES = [
  'North America (USA, Canada)',
  'Western Europe (UK, Germany, France)',
  'Asia Pacific (Singapore, Australia, Japan)',
  'Middle East & Africa (UAE, Saudi Arabia)',
  'Latin America (Brazil, Mexico)'
];

export const JOB_LEVELS = [
  'C-Suite (CEO, Founder, CFO, CIO)',
  'VPs & Directors (Sales, Marketing, HR)',
  'Heads & Managers (IT Team Leads, Procurement)',
  'Engineering & Development Leaders',
  'Operations & Admin Specialists'
];

export const COMPANY_SIZES = [
  '1 - 10 Employees (Micro Startup)',
  '11 - 50 Employees (Early Stage Startup)',
  '51 - 200 Employees (Mid-Sized Growth)',
  '201 - 500 Employees (Mid-Market Corporate)',
  '500+ Employees (Global Enterprise)'
];

export const MOCK_CONTACTS: ContactRecord[] = [
  {
    id: 'ct-1',
    firstName: 'Sarah',
    lastName: 'Chen',
    title: 'Chief Technology Officer',
    email: 's.chen@techsolutions.com',
    phone: '+1 (415) 555-0182',
    company: 'Tech Solutions Corp',
    size: '51 - 200 Employees (Mid-Sized Growth)',
    country: 'USA',
    industry: 'Technology & SaaS',
    revenue: '$18M',
    linkedin: 'linkedin.com/in/sarah-chen-tech',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-2',
    firstName: 'Marcus',
    lastName: 'Vance',
    title: 'Director of Procurement',
    email: 'marcus.vance@vancemanufacturing.com',
    phone: '+1 (312) 555-8291',
    company: 'Vance Heavy Industries',
    size: '500+ Employees (Global Enterprise)',
    country: 'USA',
    industry: 'Manufacturing',
    revenue: '$140M',
    linkedin: 'linkedin.com/in/marcusvance-industry',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-3',
    firstName: 'Elena',
    lastName: 'Rostova',
    title: 'VP of Sales',
    email: 'e.rostova@cloudsphere.io',
    phone: '+1 (650) 555-4421',
    company: 'CloudSphere Inc',
    size: '11 - 50 Employees (Early Stage Startup)',
    country: 'Canada',
    industry: 'Technology & SaaS',
    revenue: '$4.5M',
    linkedin: 'linkedin.com/in/elena-rostova-sky',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-4',
    firstName: 'David',
    lastName: 'Miller',
    title: 'VP of Facilities & Operations',
    email: 'd.miller@gothamhvac.com',
    phone: '+1 (212) 555-9302',
    company: 'Gotham Facility Services',
    size: '51 - 200 Employees (Mid-Sized Growth)',
    country: 'USA',
    industry: 'HVAC & Energy Services',
    revenue: '$12M',
    linkedin: 'linkedin.com/in/davidmiller-facilities',
    verifiedStatus: '98% Deliverability'
  },
  {
    id: 'ct-5',
    firstName: 'Aisha',
    lastName: 'Al-Hashemi',
    title: 'Chief Financial Officer',
    email: 'aisha.h@desertventures.ae',
    phone: '+971 4 555 9382',
    company: 'Desert Ventures Capital',
    size: '201 - 500 Employees (Mid-Market Corporate)',
    country: 'UAE',
    industry: 'Finance & Banking',
    revenue: '$62M',
    linkedin: 'linkedin.com/in/aisha-alhashemi-invest',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-6',
    firstName: 'Hiroshi',
    lastName: 'Tanaka',
    title: 'Head of Supply Chain & Logistics',
    email: 'h_tanaka@nipponshipping.jp',
    phone: '+81 3 5555 0192',
    company: 'Nippon Shipping Logistics',
    size: '500+ Employees (Global Enterprise)',
    country: 'Japan',
    industry: 'Logistics & Supply Chain',
    revenue: '$285M',
    linkedin: 'linkedin.com/in/tanakahiro-logistics',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-7',
    firstName: 'Chloe',
    lastName: 'Dumont',
    title: 'Director of Healthcare Operations',
    email: 'chloe.d@dumontmedical.fr',
    phone: '+33 1 55 55 94 21',
    company: 'Dumont Biotech Europe',
    size: '51 - 200 Employees (Mid-Sized Growth)',
    country: 'France',
    industry: 'Healthcare & Life Sciences',
    revenue: '$24M',
    linkedin: 'linkedin.com/in/chloe-dumont-med',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-8',
    firstName: 'Thomas',
    lastName: 'Kovacs',
    title: 'Founder & CEO',
    email: 'thomas@kovacsbuilding.co.uk',
    phone: '+44 20 7946 0190',
    company: 'Kovacs Custom Engineering',
    size: '11 - 50 Employees (Early Stage Startup)',
    country: 'UK',
    industry: 'Construction & Engineering',
    revenue: '$2.8M',
    linkedin: 'linkedin.com/in/thomaskovacs-build',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-9',
    firstName: 'Ricardo',
    lastName: 'Gomez',
    title: 'Head of E-commerce Operations',
    email: 'rgomez@aztecamarketplace.mx',
    phone: '+52 55 5555 0281',
    company: 'Azteca Marketplace',
    size: '201 - 500 Employees (Mid-Market Corporate)',
    country: 'Mexico',
    industry: 'Retail & E-commerce',
    revenue: '$14M',
    linkedin: 'linkedin.com/in/ricardogomez-ecom',
    verifiedStatus: 'Verified'
  },
  {
    id: 'ct-10',
    firstName: 'Leah',
    lastName: 'Goldberg',
    title: 'VP of Portfolio Acquisitions',
    email: 'lgoldberg@apexprime.com',
    phone: '+1 (800) 555-5201',
    company: 'Apex Prime Properties',
    size: '51 - 200 Employees (Mid-Sized Growth)',
    country: 'USA',
    industry: 'Real Estate & Brokerage',
    revenue: '$30M',
    linkedin: 'linkedin.com/in/leah-goldberg-acq',
    verifiedStatus: '98% Deliverability'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'B2B Email List & Database Builder',
    shortDesc: 'Access highly accurate, targeted B2B contact lists filtered by industry, job titles, exact regions, size, and 40+ demographic selects.',
    longDesc: 'We build custom, accurate databases that match your Ideal Customer Profile. Skip generic directories and get verified contact entries with active corporate emails, direct-dial phone numbers, and full social URLs.',
    benefits: ['95%+ Deliverability guaranteed', 'Manual triple-verification of addresses', 'Custom targeting query filter combinations', 'Compliance with GDPR, CAN-SPAM, CCPA']
  },
  {
    id: 'srv-2',
    title: 'Lead Generation & Outbound Outreach',
    shortDesc: 'Fuel your pipeline with multi-channel appointment setting, tailored cold email campaigns, and highly optimized B2B outbound workflows.',
    longDesc: 'Our outbound strategists create custom messaging sequences, manage response loops, schedule hot demo appointments, and build immediate relationships with decision-makers on your behalf.',
    benefits: ['Warm qualified introductory calls booked', 'Complete campaign copywriting and technical setup', 'Continuous optimization based on actual lead open-rates', 'Dedicated lead managers for your team']
  },
  {
    id: 'srv-3',
    title: 'Intelligent B2B Data Appending',
    shortDesc: 'Breathe new life into stale lead lists. We fill missing variables like phone numbers, updated job roles, emails, and social profiles.',
    longDesc: 'Don\'t throw away historical databases. Our automated engine matches old profiles to current active records, ensuring your sales reps don\'t waste energy dialing disconnected lines or tracking shifted positions.',
    benefits: ['Up-to-date active emails replaced', 'Direct desk numbers and cell connections appended', 'Full CRM import-ready templates provided', 'Stale contact records scrubbed']
  },
  {
    id: 'srv-4',
    title: 'Event Promotion Solutions',
    shortDesc: 'Maximize the attendance and ROI of your virtual webinars, physical booths, roundtables, and international exhibitions.',
    longDesc: 'Get highly targeted executives in seats. We run hyper-focused marketing campaigns and custom outreach lists specifically mapped to your prospective attendees based on location and industry verticals.',
    benefits: ['Guaranteed attendee benchmarks', 'Post-event feedback and database follow-ups', 'Multi-channel invitation sequencing', 'SaaS and enterprise-specific audiences']
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Rebecca Sterling',
    role: 'VP of Growth & Demand Gen',
    company: 'SynergyFlow SaaS',
    quote: 'Point to Business Services helped us map our entire target market in under 48 hours. The accuracy of their lists is unbeatable—we saw a mere 2.1% bounce rate on our outbound cold email campaign!',
    rating: 5
  },
  {
    id: 't-2',
    name: 'Jonathan Miller',
    role: 'Director of Corporate Accounts',
    company: 'North HVAC Group LLC',
    quote: 'Our sales development reps were losing hours to outdated contacts and invalid emails. Working with this platform literally doubled our outbound call-to-meeting conversion rate. Unbelievably accurate data.',
    rating: 5
  },
  {
    id: 't-3',
    name: 'Liam Harrington',
    role: 'Managing Partner',
    company: 'Harrington Logistics Partners',
    quote: 'The Custom List Builder has become a cornerstone of our quarterly corporate planning. We filter down our exact niche, review the count estimate, test sample data, and get high-quality lists in 24 hours.',
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f-1',
    question: 'How do you guarantee 95%+ B2B data accuracy?',
    answer: 'Every lead database list we supply goes through a rigorous two-step verification process. First, our database filter identifies active contacts. Second, our engineering and data teams manually triple-verify key contacts and test each corporate email server in real-time, removing bounce-prone elements before delivery.'
  },
  {
    id: 'f-2',
    question: 'Are your business lists GDPR and CCPA compliant?',
    answer: 'Absolutely. We only collect public-facing corporate profiles, business contact information, and business registries. All data delivery aligns fully with GDPR, CAN-SPAM, and CCPA legal frameworks. Every target has explicit paths for opting-out as required index standards.'
  },
  {
    id: 'f-3',
    question: 'How long does custom lead database delivery take?',
    answer: 'Standard lists built using our custom selections are triple-verified and sent to your secure dashboard or inbox within 24 to 48 hours.'
  },
  {
    id: 'f-4',
    question: 'Can I get a free sample list to test deliverability?',
    answer: 'Yes! We offer a completely free sample of 25 verified B2B contacts customized specifically to your Ideal Customer Profile. No credit card is required. Simply use the Free Sample Request forms on our page.'
  },
  {
    id: 'f-5',
    question: 'What happens if a delivered list contains bounce-back rates higher than 5%?',
    answer: 'We back our quality with a solid satisfaction guarantee. In the extremely rare event that any list contains bounce rates exceeding 5%, we immediately replace those invalid records 1-for-1 with verified replacements.'
  }
];

export const COMPETITIVE_MATRIX = {
  features: [
    { name: 'Deliverability Guarantee', target: '95%+ Guaranteed Deliverability', others: '70% - 80% (Typically stale databases)' },
    { name: 'Process Pipeline', target: 'AI Matching + Manual Quality Audits', others: 'Scraped direct and sold unverified' },
    { name: 'Pricing Transparency', target: 'Pay-per-Verified Contact (No commitments)', others: 'Heavy monthly platform subscriptions' },
    { name: 'Lead Replacements', test: true, target: '100% Free Replacements for bounces', others: 'Credit replacement structures (Hard to claim)' },
    { name: 'Global Data Compliance', target: 'GDPR, CCPA & CAN-SPAM fully verified', others: 'Grey area laws, risk of domain spam limits' }
  ]
};

// Data Generator: Calculate dynamic lists based on filters to make it interactive and super realistic!
export function calculateEstimatedContacts(
  industry: string,
  geography: string,
  role: string,
  size: string
): { totalCount: number; pricing: number; deliverability: string } {
  // Simple seed-based count to look real but consistent
  let score = 250000;
  
  if (industry) {
    const textHash = industry.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    score -= (textHash % 80) * 1200;
  }
  if (geography) {
    const textHash = geography.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    score -= (textHash % 60) * 1100;
  }
  if (role) {
    const textHash = role.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    score -= (textHash % 40) * 900;
  }
  if (size) {
    const textHash = size.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    score -= (textHash % 30) * 850;
  }
  
  const finalCount = Math.max(120, Math.floor(score / 8.5));
  // Standard pricing: roughly $0.15 to $0.45 per lead depending on size and specificity
  const perLeadPrice = 0.22;
  const cost = Math.floor(finalCount * perLeadPrice);

  return {
    totalCount: finalCount,
    pricing: cost,
    deliverability: '96.4%'
  };
}
