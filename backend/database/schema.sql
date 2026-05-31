CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'parking_attendant')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parkings (
  id UUID PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  parking_name VARCHAR(160) NOT NULL,
  available_spaces INTEGER NOT NULL CHECK (available_spaces >= 0),
  total_spaces INTEGER NOT NULL CHECK (total_spaces >= 0),
  location VARCHAR(255) NOT NULL,
  charging_fee_per_hour DECIMAL(10, 2) NOT NULL CHECK (charging_fee_per_hour >= 0),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS car_entries (
  id UUID PRIMARY KEY,
  plate_number VARCHAR(30) NOT NULL,
  parking_code VARCHAR(40) NOT NULL REFERENCES parkings(code),
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  entry_date_time TIMESTAMP NOT NULL,
  exit_date_time TIMESTAMP NULL,
  charged_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'IN' CHECK (status IN ('IN', 'OUT')),
  attendant_id UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY,
  entry_id UUID NOT NULL UNIQUE REFERENCES car_entries(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  printed_payload JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY,
  entry_id UUID NOT NULL UNIQUE REFERENCES car_entries(id) ON DELETE CASCADE,
  bill_number VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  hours_charged INTEGER NOT NULL CHECK (hours_charged >= 1),
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY,
  service_name VARCHAR(80) NOT NULL,
  action VARCHAR(120) NOT NULL,
  actor_id UUID NULL REFERENCES users(id),
  entity_name VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NOT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signup_otps (
  id UUID PRIMARY KEY,
  email VARCHAR(180) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'parking_attendant')),
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_parkings_code ON parkings(code);
CREATE INDEX IF NOT EXISTS idx_car_entries_parking_code ON car_entries(parking_code);
CREATE INDEX IF NOT EXISTS idx_car_entries_entry_time ON car_entries(entry_date_time);
CREATE INDEX IF NOT EXISTS idx_car_entries_exit_time ON car_entries(exit_date_time);
CREATE INDEX IF NOT EXISTS idx_audit_logs_service_name ON audit_logs(service_name);
