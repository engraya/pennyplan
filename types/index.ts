export interface Budget {
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
}

export interface BudgetWithStats extends Budget {
  totalSpend: number;
  totalItem: number;
}

export interface Expense {
  id: number;
  name: string;
  amount: string;
  budgetId: number | null;
  createdAt: string;
}

export interface Income {
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
}

export interface IncomeWithTotal extends Income {
  totalAmount: number;
}
