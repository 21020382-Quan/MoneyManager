import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import '@testing-library/jest-dom';
import Transactions, { AddTransactionFunction, DeleteTransactionFunction, EditTransactionFunction } from './page';
import DeleteTransactionDialog from './_components/DeleteTransactionDialog';
import { act } from 'react';
import { useRouter } from 'next/navigation';
import EditTransactionDialog from './_components/EditTransactionDialog';
import TransactionDialog from './_components/TransactionDialog';

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('Dashboard', () => {
  const mockUser = { id: '123' };
  const mockBudgets = [
    { id: '1', name: 'Budget 1', amount: 100, icon: '', totalSpent: 50, userId: '123', transactions: [] },
    { id: '2', name: 'Budget 2', amount: 200, icon: '', totalSpent: 50, userId: '123', transactions: [] },
  ];
  const mockTransactions = {
    data: [
      { id: '1', date: new Date(), amount: 50, description: 'Transaction 1', budget: 'Budget 1' },
      { id: '2', date: new Date(), amount: 100, description: 'Transaction 2', budget: 'Budget 2' },
    ]
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      pathname: "/transactions",
      query: {},
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBudgets,
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTransactions,
    })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays header', async () => {
    render(<Transactions />);

    await waitFor(() => {
      const h1 = screen.getByRole('heading', { name: /All transactions/i });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('All transactions');
    });
  });

  it('renders data table correctly', async () => {
    render(<Transactions />);

    await waitFor(() => {
      const dataTable = screen.getByTestId('data-table');
      expect(dataTable).toBeInTheDocument();

      const dataRows = screen.getAllByTestId('data-row');
      expect(dataRows).toHaveLength(mockTransactions.data.length);
    });
  });

  it('renders TransactionDialog component', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('dialog-trigger'));
    })

    await waitFor(() => {
      const descriptionInput = screen.getByLabelText(/description/i);
      const amountInput = screen.getByLabelText(/amount/i);

      expect(descriptionInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();

      const editButton = screen.getByTestId('dialog-submit')
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    });
  })

  it('renders DeleteTransactionDialog component', async () => {
    const mockDeleteTransaction : DeleteTransactionFunction = jest.fn();
    render(
      <DeleteTransactionDialog 
        id={mockTransactions.data[0].id} 
        description={mockTransactions.data[0].description} 
        onDelete={mockDeleteTransaction} 
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('delete-transaction-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-dialog-trigger'));
    })

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-dialog-submit')
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeEnabled();
    });
  });

  it('renders EditTransactionDialog component', async () => {
    const mockEditTransaction : EditTransactionFunction = jest.fn();
    render(
      <EditTransactionDialog 
        id={mockTransactions.data[0].id} 
        prevDescription={mockTransactions.data[0].description} 
        prevBudget={mockTransactions.data[0].budget}
        prevAmount={mockTransactions.data[0].amount}
        onEdit={mockEditTransaction} 
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-transaction-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-dialog-trigger'));
    })

    await waitFor(() => {
      const descriptionInput = screen.getByLabelText(/description/i);
      const amountInput = screen.getByLabelText(/amount/i);

      expect(descriptionInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();

      const editButton = screen.getByTestId('edit-dialog-submit')
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    });
  });

  it('create new transaction works properly', async () => {
    const mockNewTransaction = { id: '3', date: new Date(), amount: 100, description: 'Transaction 3', budget: 'Budget 1' }
    const mockAddTransaction : AddTransactionFunction = jest.fn();
    
    render(<TransactionDialog onAddTransaction={mockAddTransaction} budgets={mockBudgets} inBudget={true} />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('dialog-trigger'));
    })

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: mockNewTransaction.description } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: mockNewTransaction.amount } });

      const addButton = screen.getByTestId('dialog-submit');
      expect(addButton).toBeEnabled();

      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockAddTransaction).toHaveBeenCalledWith(mockBudgets);
    });
  })

  it('delete transaction works properly', async () => {
    const mockDeleteTransaction : DeleteTransactionFunction = jest.fn();
    render(
      <DeleteTransactionDialog 
        id={mockTransactions.data[0].id} 
        description={mockTransactions.data[0].description} 
        onDelete={mockDeleteTransaction} 
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('delete-transaction-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-dialog-trigger'));
    })

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-dialog-submit')
      expect(deleteButton).toBeEnabled();

      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockDeleteTransaction).toHaveBeenCalledWith(mockTransactions.data[0].id);
    });
  });

  it('edit transaction works properly', async () => {
    const mockNewTransaction = { id: '1', date: new Date(), amount: 100, description: 'New Transaction 1', budget: 'Budget 1' }
    const mockEditTransaction : EditTransactionFunction = jest.fn();
    render(
      <EditTransactionDialog 
        id={mockTransactions.data[0].id} 
        prevDescription={mockTransactions.data[0].description} 
        prevBudget={mockTransactions.data[0].budget}
        prevAmount={mockTransactions.data[0].amount}
        onEdit={mockEditTransaction} 
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-transaction-dialog')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-dialog-trigger'));
    })

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: mockNewTransaction.description } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: mockNewTransaction.amount } });

      const editButton = screen.getByTestId('edit-dialog-submit');
      expect(editButton).toBeEnabled();

      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(mockEditTransaction).toHaveBeenCalledWith(mockBudgets);
    });
  });
});
