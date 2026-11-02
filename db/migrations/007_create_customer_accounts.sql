-- V2.0: Customer accounts
-- Apply to verified development branch first.

CREATE TABLE IF NOT EXISTS public.customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT customers_name_not_blank
      CHECK (length(btrim(full_name)) > 0),
    CONSTRAINT customers_email_not_blank
      CHECK (length(btrim(email)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_email_unique_idx
ON public.customers (lower(email));
