-- Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'cashier', -- 'admin' o 'cashier'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    credit_limit DECIMAL(10,2) DEFAULT 0,
    current_balance DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    cost_price_usd DECIMAL(10,2) NOT NULL,
    profit_percentage DECIMAL(5,2) NOT NULL,
    sale_price_usd DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tasas de Cambio
CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    usd_to_ves DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Cuentas de Pago
CREATE TABLE payment_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255),
    account_type VARCHAR(100),
    currency VARCHAR(10) NOT NULL, -- 'VES' o 'USD'
    account_number VARCHAR(100),
    balance_ves DECIMAL(12,2) DEFAULT 0,
    balance_usd DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    sale_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    items JSONB NOT NULL, -- Array de items en formato JSON
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    total_ves DECIMAL(12,2) NOT NULL,
    exchange_rate DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    paid_amount_ves DECIMAL(12,2) DEFAULT 0,
    balance DECIMAL(10,2) DEFAULT 0,
    balance_ves DECIMAL(12,2) DEFAULT 0,
    payment_method VARCHAR(100),
    payment_details JSONB, -- Detalles de pagos múltiples
    payment_account_id INTEGER REFERENCES payment_accounts(id),
    payment_account_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'Crédito', 'Anulado'
    sale_date TIMESTAMP NOT NULL,
    notes TEXT,
    cashier VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id),
    sale_code VARCHAR(50),
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255),
    amount_usd DECIMAL(10,2) NOT NULL,
    amount_ves DECIMAL(12,2),
    exchange_rate DECIMAL(10,2),
    method VARCHAR(100) NOT NULL,
    payment_account_id INTEGER REFERENCES payment_accounts(id),
    payment_account_name VARCHAR(255),
    reference VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_customers_active ON customers(is_active);
