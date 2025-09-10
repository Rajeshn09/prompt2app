-- Remove the public read access policy for the waitlist table
DROP POLICY IF EXISTS "Anyone can view waitlist" ON public."Waitlist table";

-- Create a restricted policy that only allows authenticated users to view waitlist
-- Note: You may want to further restrict this to admin users only
CREATE POLICY "Authenticated users can view waitlist" 
ON public."Waitlist table" 
FOR SELECT 
TO authenticated
USING (true);

-- Alternative: If you have an admin role system, use this instead:
-- CREATE POLICY "Only admins can view waitlist" 
-- ON public."Waitlist table" 
-- FOR SELECT 
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.user_roles 
--     WHERE user_id = auth.uid() AND role = 'admin'
--   )
-- );