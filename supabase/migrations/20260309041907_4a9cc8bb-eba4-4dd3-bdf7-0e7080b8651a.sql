CREATE TABLE public.user_xp_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    xp_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_xp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp logs" 
ON public.user_xp_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp logs" 
ON public.user_xp_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.profiles 
ADD COLUMN total_xp INTEGER NOT NULL DEFAULT 0,
ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0;