-- Remove expired registration rate-limit records.
-- Run only against the verified Neon development branch.

BEGIN;

DO $$
BEGIN
  IF current_setting('neon.branch_id', true)
     IS DISTINCT FROM 'br-ancient-unit-atu8sx5v'
  THEN
    RAISE EXCEPTION 'STOP: Incorrect database branch';
  END IF;
END
$$;

DELETE FROM public.registration_rate_limits
WHERE window_start < NOW() - INTERVAL '7 days';

COMMIT;
