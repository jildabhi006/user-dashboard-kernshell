export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo?: Geo;
}

export interface Company {
  name: string;
  catchPhrase?: string;
  bs?: string;
}

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  address?: Address;
  phone: string;
  website?: string;
  company: Company;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  companyName: string;
}

export interface UpdateUserInput {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
}

export type ViewMode = 'table' | 'grid';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
