-- Optional customer city for published reviews.
-- Existing reviews remain valid with city = NULL.
-- Apply to development first, then verified production.

ALTER TABLE public.customer_reviews
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Only actual city values are accepted when provided.
ALTER TABLE public.customer_reviews
ADD CONSTRAINT customer_reviews_city_nonempty
CHECK (city IS NULL OR length(trim(city)) > 0);
