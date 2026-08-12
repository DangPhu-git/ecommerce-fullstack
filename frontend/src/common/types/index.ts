export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'CUSTOMER';
}
