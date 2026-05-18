import type { CompletedFilterMonths } from "../components/CompletedPeriodFilter";

type FilterableCompletedItem = {
  lastDate?: string | null;
  date?: string | null;
  slotStartTimeUtc?: string | null;
};

export const filterCompletedByPeriod = <T extends FilterableCompletedItem>(
  items: T[],
  period: CompletedFilterMonths
) => {
  const now = new Date();

  const getMonthsAgo = (months: number) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - months);
    return date;
  };

  return items.filter((item) => {
    const dateValue = item.lastDate ?? item.date ?? item.slotStartTimeUtc;
    const itemDate = new Date(String(dateValue ?? ""));

    if (Number.isNaN(itemDate.getTime())) {
      return false;
    }

    if (period === 3) {
      return itemDate >= getMonthsAgo(3) && itemDate <= now;
    }

    if (period === 6) {
      return itemDate >= getMonthsAgo(6) && itemDate < getMonthsAgo(3);
    }

    return itemDate >= getMonthsAgo(12) && itemDate < getMonthsAgo(6);
  });
};