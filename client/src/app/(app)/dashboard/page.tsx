import SpendingCard from "@/app/_components/SpendingCard";
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
      <>
        <div className='flex flex-wrap gap-4 justify-around'>
          {cardsInfo.map((item, index) => (
            <SpendingCard key={index} title={item.title} amount={item.amount} />
          ))}
        </div>
        <div className='mt-8'>
          Graph 
        </div>
      </>
    );
  }
  