import BudgetDialog from './_components/BudgetDialog';
import BudgetItem, { BudgetItemProps } from './_components/BudgetItem';

export default async function Budgets() {
  const fetchData = async (): Promise<BudgetItemProps[]> => {
    return [
      {
        emoji: '🛍️',
        name: 'Shopping',
        transactions: 3,
        amount: 10000000,
        totalSpent: 400,
      },
      {
        emoji: '🛍️',
        name: 'Memberships',
        transactions: 2,
        amount: 1000000,
        totalSpent: 500,
      },
      {
        emoji: '🛍️',
        name: 'Food',
        transactions: 10,
        amount: 500000,
        totalSpent: 500000,
      },
      // ...
    ];
  };
  const budgets = await fetchData();
  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">All budgets</h1>
      </div>
      <div className="mt-8 pb-24 flex flex-wrap gap-4 justify-around">
        {budgets.map((budget, index) => (
          <BudgetItem budget={budget} key={index} />
        ))}
      </div>
      <BudgetDialog/>
    </div>
  );
}