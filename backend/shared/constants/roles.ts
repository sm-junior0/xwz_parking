export const ROLES = {
  ADMIN: "admin",
  PARKING_ATTENDANT: "parking_attendant",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
