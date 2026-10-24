-- Ultimate Collections V1.3
-- Track stock deductions for safe order rejection.
-- Apply to isolated development database first.

BEGIN;

ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS stock_reserved_quantity INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.order_items
DROP CONSTRAINT IF EXISTS order_items_stock_reserved_check;

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_stock_reserved_check
CHECK (
  stock_reserved_quantity >= 0
  AND stock_reserved_quantity <= quantity
);

COMMENT ON COLUMN public.order_items.stock_reserved_quantity IS
'Quantity actually deducted from inventory at order creation; zero for legacy or untracked orders.';

COMMIT;
