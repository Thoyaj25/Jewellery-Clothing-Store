-- Ultimate Collections V1.3
-- Product inventory management
-- Apply to the isolated development database first.

BEGIN;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER;

ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS products_stock_quantity_nonnegative;

ALTER TABLE public.products
ADD CONSTRAINT products_stock_quantity_nonnegative
CHECK (stock_quantity IS NULL OR stock_quantity >= 0);

COMMENT ON COLUMN public.products.stock_quantity IS
'NULL = inventory not configured; 0 = out of stock; positive = available units';

COMMIT;
