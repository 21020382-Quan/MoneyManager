// Test file
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import '@testing-library/jest-dom';
import Budget, { EditBudgetFunction } from './page';
import { useRouter } from 'next/navigation';
import { toLocalMoney } from '@/lib/utils';
import EditBudgetDialog from './_components/EditBudgetDialog';
import DeleteBudgetDialog from './_components/DeleteBudgetDialog';

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('Dashboard', () => {
  const mockUser = { id: '123' };
  const mockTransactions = [
    {
      id: '1',
      description: 'Transaction 1',
      amount: 20,
    },
    {
      id: '2',
      description: 'Transaction 2',
      amount: 30,
    },
  ]
  const mockBudget = {
    id: '1',
    name: 'Budget 1',
    amount: 100,
    transactions: mockTransactions,
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      pathname: `/budget/${mockBudget.id}`,
      query: {},
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBudget,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays header', async () => {
    render(<Budget params={{ id: mockBudget.id }} />);

    await waitFor(() => {
      const h1 = screen.getByRole('heading', { name: /Budget/i });
      expect(h1).toBeInTheDocument();
    });
  });

  it('renders budget info', async () => {
    render(<Budget params={{ id: mockBudget.id }} />);

    await waitFor(() => {
      const budgetItem = screen.getByTestId('budget-item');
      expect(budgetItem).toBeInTheDocument();
    });

    const name = screen.getByTestId("budget-name");
    const amount = screen.getByTestId("budget-amount");

    expect(name).toBeInTheDocument();
    expect(amount).toBeInTheDocument();

    expect(name).toHaveTextContent(mockBudget.name);
    expect(amount).toHaveTextContent(toLocalMoney(mockBudget.amount));
  });

  it('renders EditBudgetDialog component', async () => {
    render(<Budget params={{ id: mockBudget.id }} />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-budget-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-dialog-trigger'));
    });

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      const amountInput = screen.getByLabelText(/amount/i);

      expect(nameInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();

      const editButton = screen.getByTestId('edit-dialog-submit')
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    });
  });

  it('renders DeleteBudgetDialog component', async () => {
    render(<Budget params={{ id: mockBudget.id }} />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-budget-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-dialog-trigger'));
    });

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-dialog-submit')
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeEnabled();
    });
  });

  it('renders all transactions', async () => {
    render(<Budget params={{ id: mockBudget.id }} />);

    await waitFor(() => {
      const dataTable = screen.getByTestId('data-table');
      expect(dataTable).toBeInTheDocument();
    });

    mockBudget.transactions.forEach((transaction) => {
      expect(screen.getByText(transaction.description)).toBeInTheDocument();
      expect(screen.getByText(toLocalMoney(transaction.amount))).toBeInTheDocument();
    })
  });

  it('edit budget works properly', async () => {
    const mockOnEditBudget: EditBudgetFunction = jest.fn();
    const mockNewBudget = { id: '1', name: 'New Budget 1', amount: 150, icon: '', transactions: mockTransactions };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockNewBudget,
    });
    // render(<Budget params={{ id: mockBudget.id }} />);
    render(<EditBudgetDialog id={mockBudget.id} prevName={mockBudget.name} prevIcon='' prevAmount={mockBudget.amount} onEditBudget={mockOnEditBudget} />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-budget-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-dialog-trigger'));
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: mockNewBudget.name } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: mockNewBudget.amount } });

      const editButton = screen.getByTestId('edit-dialog-submit');
      expect(editButton).toBeEnabled();

      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(mockOnEditBudget).toHaveBeenCalledWith(mockBudget);
    });
  });

  it('delete budget works properly', async () => {
    // render(<Budget params={{ id: mockBudget.id }} />);
    render(<DeleteBudgetDialog id={mockBudget.id} name={mockBudget.name} />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-budget-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-dialog-trigger'));
    });

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-dialog-submit');
      expect(deleteButton).toBeEnabled();

      fireEvent.click(deleteButton);
    });
  });
});
