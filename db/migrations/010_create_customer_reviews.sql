-- Customer reviews with admin moderation.
-- Apply to the verified development database first.

CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text VARCHAR(1000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'approved', 'rejected')),
    source VARCHAR(20) NOT NULL DEFAULT 'website'
      CHECK (source IN ('website', 'whatsapp')),
    consent_to_publish BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    CONSTRAINT customer_review_name_nonempty
      CHECK (length(trim(customer_name)) > 0),
    CONSTRAINT customer_review_text_nonempty
      CHECK (length(trim(review_text)) > 0)
);

CREATE INDEX IF NOT EXISTS customer_reviews_public_idx
ON public.customer_reviews (created_at DESC)
WHERE status = 'approved' AND consent_to_publish = TRUE;

CREATE INDEX IF NOT EXISTS customer_reviews_pending_idx
ON public.customer_reviews (created_at DESC)
WHERE status = 'pending';

-- Independent rate limiting for customer reviews.
CREATE TABLE IF NOT EXISTS public.review_rate_limits (
    identifier_hash TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1
      CHECK (attempt_count > 0),
    PRIMARY KEY (identifier_hash, window_start)
);

CREATE INDEX IF NOT EXISTS review_rate_limits_window_idx
ON public.review_rate_limits (window_start);

-- Application permissions for customer review workflows.
GRANT SELECT, INSERT, UPDATE
ON public.customer_reviews
TO ultimate_collections_app;

GRANT USAGE
ON SEQUENCE public.customer_reviews_id_seq
TO ultimate_collections_app;

GRANT SELECT, INSERT, UPDATE
ON public.review_rate_limits
TO ultimate_collections_app;
