import { createMockUiData } from '@/hooks/useMockData';

describe('useMockData', () => {
  it('should include routine and study categories', () => {
    const mockData = createMockUiData();
    const categoryNames = mockData.categories.map((category) => category.name);

    expect(categoryNames).toContain('Routine');
    expect(categoryNames).toContain('讀書');
  });

  it('should include purchased items for today bar', () => {
    const mockData = createMockUiData();

    expect(mockData.purchasedToday).toHaveLength(2);
    expect(mockData.purchasedToday[0].status).toBe('completed');
    expect(mockData.purchasedToday[1].status).toBe('purchased');
  });
});
