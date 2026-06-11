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

export interface AiChatMessage {
  role: "user" | "model";
  content: string;
}

export interface ForecastItem {
  budgetId: number;
  budgetName: string;
  budgetAmount: number;
  currentSpend: number;
  projectedSpend: number;
  projectedOverage: number;
  narrative: string;
}

export interface HealthScore {
  score: number;
  explanation: string;
}

export interface BudgetSetupItem {
  name: string;
  amount: number;
  icon: string;
  reasoning: string;
}
