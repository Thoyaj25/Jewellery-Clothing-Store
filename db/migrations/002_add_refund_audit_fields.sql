-- Ultimate Collections V1.1
-- Add dedicated refund audit fields.
-- Apply only to the development database after verification.

BEGIN;

ALTER TABLE public.order_payments
    ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS refunded_by VARCHAR(150),
    ADD COLUMN IF NOT EXISTS refund_reference VARCHAR(200);

COMMIT;
