// Prices are written here on purpose: the landing never calls /api/plans
// (the API has no CORS) and must not break when the backend changes.
// Source of truth: the dashboard's plans table.
// Free: 4 single posts/month (no carousel, no video);
// re-check the admin panel (Subscriptions) before publishing in case it was edited.
export interface Plan {
  id: 'free' | 'starter' | 'pro';
  price: string; // monthly, USD only; no Toman price has been set yet
  yearly?: string; // ten months for twelve (plan_prices, migration 0062)
  yearlyPerMonth?: string;
  popular?: boolean;
  brands: number;
  perWeek: number | null; // max posts per week (null = about 1/week for Free)
  monthly?: { single: number; carousel: number; video: number; total: number };
}

export const plans: Plan[] = [
  { id: 'free', price: '$0', brands: 1, perWeek: 1 },
  {
    id: 'starter',
    price: '$9.99',
    yearly: '$99',
    yearlyPerMonth: '$8.25',
    brands: 1,
    perWeek: 3,
    monthly: { single: 10, carousel: 3, video: 2, total: 15 },
  },
  {
    id: 'pro',
    price: '$19.99',
    yearly: '$199',
    yearlyPerMonth: '$16.58',
    popular: true,
    brands: 3,
    perWeek: 7,
    monthly: { single: 25, carousel: 8, video: 4, total: 37 },
  },
];
