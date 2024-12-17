import { render, screen, waitFor } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import '@testing-library/jest-dom';
import Dashboard from './page';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AllBudgetsBarChart from './_components/AllBudgetsBarChart';

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock global fetch function
global.fetch = jest.fn();

describe('Dashboard', () => {
  const mockUser = { id: '123' };
  const mockBudgets = [
    { id: '1', name: 'Budget 1', amount: 100, totalSpent: 50 },
    { id: '2', name: 'Budget 2', amount: 200, totalSpent: 100 },
  ];
  const mockSpendings = [
    { date: new Date(), amount: 100 },
    { date: new Date(), amount: 200 },
  ];

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/dashboard',
      query: {},
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('lastWeek'),
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpendings,
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBudgets,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays header', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      const h1 = screen.getByRole('heading', { name: /Dashboard/i });
      expect(h1).toBeInTheDocument();
    });
  });

  it('renders all charts correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      const allSpendingsChart = screen.getByTestId('all-spendings-chart');
      const allBudgetsBarChart = screen.getByTestId('all-budgets-bar-chart');
      const allBudgetsPercentageChart = screen.getByTestId('all-budgets-percentage-chart');

      expect(allSpendingsChart).toBeInTheDocument();
      expect(allBudgetsBarChart).toBeInTheDocument();
      expect(allBudgetsPercentageChart).toBeInTheDocument();
    });
  });
});
