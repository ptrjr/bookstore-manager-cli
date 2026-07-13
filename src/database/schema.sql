DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS authors;

-- =========================================================
-- AUTHORS
-- =========================================================

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50)
);

-- =========================================================
-- CUSTOMERS
-- =========================================================

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20)
);

-- =========================================================
-- BOOKS
-- =========================================================

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    publication_year INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    author_id INTEGER NOT NULL,

    CONSTRAINT check_book_stock_quantity
        CHECK (stock_quantity >= 0),

    CONSTRAINT fk_books_author
        FOREIGN KEY (author_id)
        REFERENCES authors(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =========================================================
-- LOANS
-- =========================================================

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT check_loan_status
        CHECK (status IN ('ACTIVE', 'RETURNED')),

    CONSTRAINT check_loan_due_date
        CHECK (due_date >= loan_date),

    CONSTRAINT check_loan_return_date
        CHECK (
            return_date IS NULL
            OR return_date >= loan_date
        ),

    CONSTRAINT check_returned_loan
        CHECK (
            (status = 'ACTIVE' AND return_date IS NULL)
            OR
            (status = 'RETURNED' AND return_date IS NOT NULL)
        ),

    CONSTRAINT fk_loans_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_loans_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_books_author_id
    ON books(author_id);

CREATE INDEX idx_loans_customer_id
    ON loans(customer_id);

CREATE INDEX idx_loans_book_id
    ON loans(book_id);

CREATE INDEX idx_loans_status
    ON loans(status);