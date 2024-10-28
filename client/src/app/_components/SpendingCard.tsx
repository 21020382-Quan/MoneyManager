interface SpendingCardProps {
  title: string
  amount: number

}

export default function SpendingCard({ 
  title, 
  amount,
} : SpendingCardProps) {
  return (
    <div className='p-4 rounded-lg shadow-md border min-w-44'>
      <div className='text-xs text-gray-500 font-bold'>{title}</div>
      <div className='font-bold text-xl'>VND {amount.toLocaleString()}</div>
    </div>
  );
}