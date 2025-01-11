export interface Employee {
    id: number;
    username: string;
    email: string;
    employee_type: 'HR' | 'NORMAL';
    first_name: string;
    last_name: string;
  }
  
  export interface Attendance {
    id: number;
    employee: number;
    employee_name: string;
    date: string;
    is_present: boolean;
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface LoginResponse {
    access: string;
    refresh: string;
    user: Employee;
  }