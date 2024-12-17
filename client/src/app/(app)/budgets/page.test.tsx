import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import Budgets, { AddBudgetFunction } from './page';
import '@testing-library/jest-dom';
import { toLocalMoney } from '@/lib/utils';
import BudgetDialog from './_components/BudgetDialog';

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

global.fetch = jest.fn();

describe('Budgets', () => {
  const mockUser = { id: '123' };
  const mockBudgets = [
    { id: '1', name: 'Budget 1', amount: 100 },
    { id: '2', name: 'Budget 2', amount: 200 },
  ];

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useToast as jest.Mock).mockReturnValue({ toast: jest.fn() });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockBudgets,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays header', async () => {
    render(<Budgets />);
    await waitFor(() => {
      const h1 = screen.getByRole('heading', { name: /All budgets/i });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('All budgets');
    });
  });

  it('renders all BudgetItem components', async () => {
    render(<Budgets />);
    await waitFor(() => {
      const budgetItems = screen.getAllByTestId('budget-item');
      expect(budgetItems.length).toBe(mockBudgets.length);
    });

    mockBudgets.forEach((budget) => {
      expect(screen.getByText(budget.name)).toBeInTheDocument();
      expect(screen.getByText(toLocalMoney(budget.amount))).toBeInTheDocument();
    });
  });

  it('renders BudgetDialog component', async () => {
    render(<Budgets />);

    await waitFor(() => {
      expect(screen.getByTestId('budget-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('dialog-trigger'));
    });

    await waitFor(() => {
      const nameLabel = screen.getByText(/name/i);
      const amountLabel = screen.getByText(/amount/i);

      expect(nameLabel).toBeInTheDocument();
      expect(amountLabel).toBeInTheDocument();

      const nameInput = screen.getByLabelText(/name/i);
      const amountInput = screen.getByLabelText(/amount/i);

      expect(nameInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();

      const createButton = screen.getByTestId('dialog-submit');
      expect(createButton).toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });
  });

  it('create new budget works properly', async () => {
    const mockOnAddBudget: AddBudgetFunction = jest.fn();
    const mockNewBudget = { id: '3', name: 'Budget 3', amount: 150 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockNewBudget,
    });
    render(<BudgetDialog onAddBudget={mockOnAddBudget} />);

    await waitFor(() => {
      expect(screen.getByTestId('budget-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('dialog-trigger'));
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Budget 3' } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '150' } });

      const createButton = screen.getByTestId('dialog-submit');
      expect(createButton).toBeEnabled();

      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(mockOnAddBudget).toHaveBeenCalledWith(mockNewBudget);
    });
  });
});
