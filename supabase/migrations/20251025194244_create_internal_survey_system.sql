-- Create surveys table
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_questions table
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR NOT NULL CHECK (question_type IN ('text', 'textarea', 'radio', 'checkbox', 'select', 'scale', 'number', 'likert')),
    options JSONB,
    is_required BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_participants table
CREATE TABLE IF NOT EXISTS public.survey_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    current_question_index INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, survey_id)
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.survey_participants(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    response_value TEXT NOT NULL,
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_id, question_id)
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS survey_questions_survey_id_order_idx ON public.survey_questions(survey_id, order_index);
CREATE INDEX IF NOT EXISTS survey_participants_user_id_idx ON public.survey_participants(user_id);
CREATE INDEX IF NOT EXISTS survey_participants_survey_id_idx ON public.survey_participants(survey_id);
CREATE INDEX IF NOT EXISTS survey_responses_participant_id_idx ON public.survey_responses(participant_id);
CREATE INDEX IF NOT EXISTS survey_responses_question_id_idx ON public.survey_responses(question_id);

-- Enable RLS on all tables
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for surveys table (read-only for authenticated users)
CREATE POLICY "Authenticated users can view active surveys" ON public.surveys
    FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

-- RLS Policies for survey_questions table (read-only for authenticated users)
CREATE POLICY "Authenticated users can view survey questions" ON public.survey_questions
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM public.surveys WHERE is_active = true
        )
    );

-- RLS Policies for survey_participants table
CREATE POLICY "Users can view own participation" ON public.survey_participants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own participation" ON public.survey_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation" ON public.survey_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for survey_responses table
CREATE POLICY "Users can view own responses" ON public.survey_responses
    FOR SELECT USING (
        participant_id IN (
            SELECT id FROM public.survey_participants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own responses" ON public.survey_responses
    FOR INSERT WITH CHECK (
        participant_id IN (
            SELECT id FROM public.survey_participants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own responses" ON public.survey_responses
    FOR UPDATE USING (
        participant_id IN (
            SELECT id FROM public.survey_participants WHERE user_id = auth.uid()
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT ON public.surveys TO authenticated;
GRANT SELECT ON public.survey_questions TO authenticated;
GRANT ALL ON public.survey_participants TO authenticated;
GRANT ALL ON public.survey_responses TO authenticated;

-- Grant permissions to service_role for admin operations
GRANT ALL ON public.surveys TO service_role;
GRANT ALL ON public.survey_questions TO service_role;
GRANT ALL ON public.survey_participants TO service_role;
GRANT ALL ON public.survey_responses TO service_role;