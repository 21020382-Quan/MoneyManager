import TransactionDialog from "./_components/TransactionDialog";
import TransactionItem from "./_components/TransactionItem";

interface TransactionItemProps {
  description: string,
  amount: number,
  date: string,
};

export default function Transactions() {
  const transactions: TransactionItemProps[] = [
    {
      description: 'Lorem ipsum',
      amount: 100,
      date: '1/1/2000',
    },
    {
      description: 'Lorem ipsum',
      amount: 100,
      date: '1/1/2000',
    },
    {
      description: 'Lorem ipsum',
      amount: 100,
      date: '1/1/2000',
    },
    {
      description: 'Lorem ipsum',
      amount: 100,
      date: '1/1/2000',
    },
    {
      description: 'Lorem ipsum',
      amount: 100,
      date: '1/1/2000',
    },
  ]
  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">All transactions</h1>
      </div>
      <div className="mt-12 grid grid-cols-4 bg-blue-500 p-4">
        <h2 className="font-bold text-white">Description</h2>
        <h2 className="font-bold text-white">Amount</h2>
        <h2 className="font-bold text-white">Date</h2>
        <h2 className="font-bold text-white">Actions</h2>
      </div>
      {transactions.map((transaction, index) => (
        <TransactionItem transaction={transaction} index={index} key={index} />
      ))}
      <TransactionDialog />
    </div>
  );
}
