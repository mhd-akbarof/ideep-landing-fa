// Prices are written here on purpose: the landing never calls the API
// and must not break when the backend changes.
// Toman prices for the Iranian site. Yearly = ten months for twelve (same rule as the English site).
// Free: 4 single posts/month (no carousel, no video).
export interface Plan {
  id: 'free' | 'starter' | 'pro';
  price: string; // monthly, Toman
  yearly?: string;
  yearlyPerMonth?: string;
  popular?: boolean;
  brands: number;
  perWeek: number | null; // max posts per week (null = about 1/week for Free)
  monthly?: { single: number; carousel: number; video: number; total: number };
}

export const plans: Plan[] = [
  { id: 'free', price: '۰', brands: 1, perWeek: 1 },
  {
    id: 'starter',
    price: '۱٬۹۹۰٬۰۰۰',
    yearly: '۱۹٬۹۰۰٬۰۰۰',
    yearlyPerMonth: '۱٬۶۵۸٬۰۰۰',
    brands: 1,
    perWeek: 3,
    monthly: { single: 10, carousel: 3, video: 2, total: 15 },
  },
  {
    id: 'pro',
    price: '۴٬۹۹۰٬۰۰۰',
    yearly: '۴۹٬۹۰۰٬۰۰۰',
    yearlyPerMonth: '۴٬۱۵۸٬۰۰۰',
    popular: true,
    brands: 3,
    perWeek: 7,
    monthly: { single: 25, carousel: 8, video: 4, total: 37 },
  },
];
