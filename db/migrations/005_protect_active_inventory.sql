-- Ultimate Collections V1.3
-- Migration 005: Prevent disabling configured inventory tracking.
--
-- Once stock_quantity is configured, it must remain a non-null
-- integer. Zero is allowed and represents out-of-stock.
--
-- This trigger checks only the current product row and does
-- not lock orders or order_items.

CREATE OR REPLACE FUNCTION public.prevent_inventory_tracking_reset()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.stock_quantity IS NOT NULL
     AND NEW.stock_quantity IS NULL THEN
    RAISE EXCEPTION
      'Inventory tracking cannot be disabled once configured'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_inventory_tracking_reset
ON public.products;

CREATE TRIGGER trg_prevent_inventory_tracking_reset
BEFORE UPDATE OF stock_quantity
ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.prevent_inventory_tracking_reset();
