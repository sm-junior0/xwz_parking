export type Role = "admin" | "parking_attendant";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Parking {
  id: string;
  code: string;
  parkingName: string;
  availableSpaces: number;
  totalSpaces: number;
  location: string;
  chargingFeePerHour: number;
  createdAt: string;
}

export interface CarEntry {
  id: string;
  plateNumber: string;
  parkingCode: string;
  ticketNumber: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  status: "IN" | "OUT";
  attendantId?: string | null;
}

export interface Ticket {
  id: string;
  entryId: string;
  ticketNumber: string;
  issuedAt: string;
  printedPayload: Record<string, string>;
}

export interface Bill {
  id: string;
  entryId: string;
  billNumber: string;
  amount: number;
  hoursCharged: number;
  generatedAt: string;
  paymentStatus: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
