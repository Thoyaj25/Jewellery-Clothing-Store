-- Independent rate limiting for guest order submissions.
-- Apply to development before production.

CREATE TABLE IF NOT EXISTS public.order_submission_rate_limits (
    identifier_hash TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1
      CHECK (attempt_count > 0),
    PRIMARY KEY (identifier_hash, window_start)
);

CREATE INDEX IF NOT EXISTS order_submission_rate_limits_window_idx
ON public.order_submission_rate_limits (window_start);

GRANT SELECT, INSERT, UPDATE
ON public.order_submission_rate_limits
TO ultimate_collections_app;
