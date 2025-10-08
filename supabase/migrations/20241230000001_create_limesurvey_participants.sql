-- Create table for LimeSurvey participants
CREATE TABLE IF NOT EXISTS public.limesurvey_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    survey_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    firstname TEXT,
    lastname TEXT,
    email TEXT,
    limesurvey_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index to prevent duplicate participants
CREATE UNIQUE INDEX IF NOT EXISTS limesurvey_participants_user_survey_idx 
ON public.limesurvey_participants(user_id, survey_id);

-- Enable RLS
ALTER TABLE public.limesurvey_participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own participants" ON public.limesurvey_participants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participants" ON public.limesurvey_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participants" ON public.limesurvey_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.limesurvey_participants TO authenticated;
GRANT ALL ON public.limesurvey_participants TO service_role;