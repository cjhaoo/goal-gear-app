import { GearCard } from '@/components/common/GearCard';
import type { UiPurchasedGear } from '@/types/ui';

interface PurchasedBarProps {
  purchasedToday: UiPurchasedGear[];
}

export const PurchasedBar = ({ purchasedToday }: PurchasedBarProps) => (
  <footer className="rounded-xl border border-slate-600 bg-slate-800 p-3">
    <h3 className="mb-2 text-sm font-semibold text-slate-100">已購買裝備（今日）</h3>
    <div className="flex gap-3 overflow-x-auto pb-1">
      {purchasedToday.map((gear) => (
        <div key={gear.id} className="min-w-[180px]">
          <GearCard title={gear.name} status={gear.status} compact>
            <button
              type="button"
              className="mt-1 rounded-md border border-slate-500 px-2 py-1 text-xs text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              complete
            </button>
          </GearCard>
        </div>
      ))}
    </div>
  </footer>
);
