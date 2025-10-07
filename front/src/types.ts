export interface Plan {
  id: number;
  name: string;
  price: number;
  storage: number;
  quotas: number;
}

export interface Contract {
  id: number;
  plan_id: number;
  user_id: number;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'inactive';
  plan: Plan;
}

export interface User {
  id: number;
  name: string;
  email: string;
  active_contract: Contract | null;
  contracts: Contract[];
}
