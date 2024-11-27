"use client"

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { toLocalMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetItemInfo } from "../../budgets/_components/BudgetItem"

interface ChartProps {
  budgets: BudgetItemInfo[]
}

export default function AllBudgetsPercentageChart({budgets} : ChartProps) {
  console.log(budgets);
  const data = budgets.map((budget) => {
    return {
      amount: budget.amount,
      name: budget.name,
    }
  })
  const colors = [
    "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16", 
    "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9", 
    "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", 
    "#EC4899", "#F43F5E", "#78716C", "#737373", "#71717A", 
    "#6B7280", "#64748B",
  ];
  const renderCustomizedLabel = ({ percent }: { percent: number }) => {
    return `${(percent * 100).toFixed(1)}%`
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>All budgets (percentage)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart margin={{left: 20, top: 20, bottom: 20, right: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <Pie dataKey="amount" data={data} fill="#2196F3" label={renderCustomizedLabel}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
            </Pie>
            <Tooltip formatter={value => toLocalMoney(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}