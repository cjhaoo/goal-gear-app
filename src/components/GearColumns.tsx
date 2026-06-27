import { GearCard } from '@/components/common/GearCard';
import { ProgressBar } from '@/components/common/ProgressBar';
import type { UiCategoryData } from '@/types/ui';

interface GearColumnsProps {
  category: UiCategoryData;
}

const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

export const GearColumns = ({ category }: GearColumnsProps) => (
  <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <div className="rounded-xl border border-slate-600 bg-slate-800 p-3">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">小裝備</h3>
      <div className="grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto pr-1">
        {category.smallGears.map((gear) => (
          <GearCard
            key={gear.id}
            title={gear.name}
            subtitle={formatSeconds(gear.durationSeconds)}
            status={gear.status}
            compact
          />
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-slate-600 bg-slate-800 p-3">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">中裝備</h3>
      <div className="space-y-3">
        {category.mediumGears.map((gear) => (
          <GearCard
            key={gear.id}
            title={gear.name}
            subtitle={`${gear.smallGearCount} 個小裝備 · ${formatSeconds(gear.totalSeconds)}`}
            status={gear.progress >= 1 ? 'completed' : gear.progress > 0 ? 'purchased' : 'available'}
          >
            <ProgressBar value={gear.progress} />
          </GearCard>
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-slate-600 bg-slate-800 p-3">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">大裝備</h3>
      <div className="space-y-3">
        {category.largeGears.map((gear) => (
          <GearCard
            key={gear.id}
            title={gear.name}
            subtitle={`${gear.mediumGearCount} 個中裝備 · ${formatSeconds(gear.totalSeconds)}`}
            status={gear.progress >= 1 ? 'completed' : gear.progress > 0 ? 'purchased' : 'available'}
          >
            <div className="space-y-1">
              <ProgressBar value={gear.progress} />
              <p className="text-right text-xs text-slate-300">{Math.round(gear.progress * 100)}%</p>
            </div>
          </GearCard>
        ))}
      </div>
    </div>
  </section>
);
