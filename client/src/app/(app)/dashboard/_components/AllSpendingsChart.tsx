"use client"

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { rangeOptions, toLocalMoney } from "@/lib/utils"
import { Spending } from "../page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface ChartProps {
  spendings: Spending[]
}

export default function AllSpendingsChart({spendings} : ChartProps) {
  const data = spendings.map((spending) => {
    return {
      value: spending.amount,
      date: spending.date,
    }
  })
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const setRange = (range: keyof typeof rangeOptions) => {
    const params = new URLSearchParams(searchParams);
    params.set("spendingRange", range);
    router.push(`${pathname}?${params.toString()}`, {scroll: false});
  }
  return (
    <div data-testid="all-spendings-chart">
      <Card>
        <CardHeader>
          <div className="flex gap-4 justify-between items-center">
            <CardTitle>All spendings</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Range</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(rangeOptions).map(([key, value]) => (
                  <DropdownMenuItem key={key} onClick={() => setRange(key as keyof typeof rangeOptions)}>{value.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{left: 50, top: 10, bottom: 10, right: 10}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={tick => toLocalMoney(tick)} />
              <Tooltip formatter={value => toLocalMoney(value as number)} />
              <Legend />
              <Line dataKey="value" type="monotone" name="Total Spent" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}