import { GearColumns } from '@/components/GearColumns';
import { PurchasedBar } from '@/components/PurchasedBar';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { useMockData } from '@/hooks/useMockData';

export const Home = () => {
  const { categories, selectedCategoryId, selectedCategory, setSelectedCategoryId, purchasedToday } = useMockData();

  return (
    <main className="mx-auto flex h-screen max-w-[1400px] flex-col gap-4 p-4 text-slate-100">
      <TopBar />

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <GearColumns category={selectedCategory} />
      </section>

      <PurchasedBar purchasedToday={purchasedToday} />

      <div className="hidden" aria-hidden>
        Modal / Drawer Placeholder
      </div>
    </main>
  );
};
