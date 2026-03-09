
CREATE TABLE public.exercise_error_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID REFERENCES public.learning_exercises(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.learning_lessons(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exercise_error_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own exercise error reports"
  ON public.exercise_error_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own exercise error reports"
  ON public.exercise_error_reports
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all exercise error reports"
  ON public.exercise_error_reports
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
