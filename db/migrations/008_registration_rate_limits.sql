-- V2.0: Registration request rate limiting
-- Apply to the verified development branch first.

CREATE TABLE IF NOT EXISTS public.registration_rate_limits (
    identifier_hash TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (identifier_hash, window_start),
    CONSTRAINT registration_attempt_count_positive
      CHECK (attempt_count > 0)
);

CREATE INDEX IF NOT EXISTS registration_rate_limits_window_idx
ON public.registration_rate_limits (window_start);
