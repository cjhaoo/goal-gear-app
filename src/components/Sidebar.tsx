import type { UiCategorySummary } from '@/types/ui';

interface SidebarProps {
  categories: UiCategorySummary[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const Sidebar = ({ categories, selectedCategoryId, onSelectCategory }: SidebarProps) => (
  <aside className="rounded-xl border border-slate-600 bg-slate-800 p-3">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-100">分類</h2>
      <button
        type="button"
        className="rounded-md border border-slate-500 px-2 py-1 text-xs text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
      >
        +
      </button>
    </div>

    <div className="space-y-2 overflow-y-auto pr-1">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              isSelected
                ? 'border-blue-500 bg-blue-500/20 text-blue-100'
                : 'border-slate-600 bg-slate-900/50 text-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>{category.name}</span>
              <span className="text-xs text-slate-400">{category.largeGearCount}</span>
            </div>
          </button>
        );
      })}
    </div>
  </aside>
);
