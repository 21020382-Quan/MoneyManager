"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { rangeOptions, toLocalMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BudgetItemInfo } from "../../budgets/_components/BudgetItem"

interface ChartProps {
  budgets: BudgetItemInfo[]
}

export default function AllBudgetsBarChart({budgets} : ChartProps) {
  const data = budgets.map((budget) => {
    return {
      totalSpent: budget.totalSpent,
      remaining: budget.amount - budget.totalSpent,
      name: budget.name,
    }
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>All budgets (amount)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{left: 50, top: 10, bottom: 10, right: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={tick => toLocalMoney(tick)} />
            <Tooltip formatter={value => toLocalMoney(value as number)} />
            <Legend />
            <Bar dataKey="totalSpent" stackId="a" fill="#2196F3" name="Total spent" />
            <Bar dataKey="remaining" stackId="a" fill="#9E9E9E" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}