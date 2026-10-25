-- Ultimate Collections V1.3
-- Migration 006: Protect product references in order history.
--
-- Prevents physical deletion of products referenced by order items.
-- Admins should hide historical products instead of deleting them.
--
-- Run after migrations 003, 004 and 005.

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE RESTRICT;
