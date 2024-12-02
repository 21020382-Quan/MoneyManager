"use client"

import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { rangeOptions, toLocalMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BudgetItemInfo } from "../../budgets/_components/BudgetItem"

interface ChartProps {
  budgets: BudgetItemInfo[]
}

export default function AllBudgetsBarChart({budgets} : ChartProps) {
  const colors = ["#EF4444", "#3B82F6", "#6B7280"]
  const data = budgets.map((budget) => {
    const remaining = Math.max(budget.amount - budget.totalSpent, 0)
    const totalSpent = budget.totalSpent
    const isCritical = totalSpent / (remaining + totalSpent) >= 0.8
    return {
      totalSpent,
      remaining,
      name: budget.name,
      isCritical,
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
            <Bar dataKey="totalSpent" stackId="a" name="Total spent">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isCritical ? colors[0] : colors[1]}
                />
              ))}
            </Bar>
            <Bar dataKey="remaining" stackId="a" fill={colors[2]} name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}