import SpendingCard from "@/app/(app)/dashboard/_components/SpendingCard";
import getUser, { User } from "@/lib/user";

interface SpendingCardProps {
  title: string
  amount: number
}

export default async function Dashboard() {
  const cardsInfo: SpendingCardProps[] = [
    {
      title: "Today's spending",
      amount: 10000,
    },
    {
      title: "This week's spending",
      amount: 100000,
    },
    {
      title: "This month's spending",
      amount: 500000,
    },
    {
      title: "This month's budget",
      amount: 1000000,
    },
  ]
  const user = getUser();
  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">Dashboard</h1>
      </div>
      <div className='mt-8 flex flex-wrap gap-4 justify-around'>
        {cardsInfo.map((item, index) => (
          <SpendingCard key={index} title={item.title} amount={item.amount} />
        ))}
      </div>
      <div className='mt-8'>
        Graph 
      </div>
    </div>
  );
}
  