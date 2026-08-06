import type { SubscriptionPlan } from "./types";

/**
 * UI fallback for the rows seeded into public.subscription_plans.
 * Keep identifiers and business values in sync with the Supabase migration.
 */
export const subscriptionPlans: SubscriptionPlan[] = [
  { id: "free", name: "Свободный", durationDays: 1, priceRub: 0, dailyPointAllowance: 100, isFeatured: false },
  { id: "3d", name: "Искра·3 дня", durationDays: 3, priceRub: 149, dailyPointAllowance: null, isFeatured: false },
  { id: "7d", name: "Искра·Неделя", durationDays: 7, priceRub: 299, dailyPointAllowance: null, isFeatured: false },
  { id: "month", name: "Искра·Месяц", durationDays: 30, priceRub: 500, dailyPointAllowance: null, isFeatured: true },
  { id: "year", name: "Искра·Год", durationDays: 365, priceRub: 4490, dailyPointAllowance: null, isFeatured: false },
];

export function getDurationLabel(durationDays: number): string {
  const mod100 = durationDays % 100;
  const mod10 = durationDays % 10;
  const unit = mod100 >= 11 && mod100 <= 14 ? "дней" : mod10 === 1 ? "день" : mod10 >= 2 && mod10 <= 4 ? "дня" : "дней";
  return `${durationDays} ${unit}`;
}

export function getDailyPriceRub(plan: SubscriptionPlan): number | null {
  return plan.priceRub > 0 ? plan.priceRub / plan.durationDays : null;
}
