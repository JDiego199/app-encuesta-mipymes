-- Create internal survey system tables
-- Execute this SQL in your Supabase SQL editor

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey questions table
CREATE TABLE IF NOT EXISTS survey_questions (
  id VARCHAR(50) PRIMARY KEY, -- Using the Excel ID like 'h01', 'I001', etc.
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('text', 'textarea', 'radio', 'checkbox', 'select', 'scale', 'number', 'likert')),
  options JSONB, -- For radio, checkbox, select options
  likert_config JSONB, -- For likert scale configuration
  dimension VARCHAR(255),
  subdimension VARCHAR(255),
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey participants table
CREATE TABLE IF NOT EXISTS survey_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  current_question_index INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, survey_id)
);

-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES survey_participants(id) ON DELETE CASCADE,
  question_id VARCHAR(50) REFERENCES survey_questions(id) ON DELETE CASCADE,
  response_value TEXT,
  response_data JSONB, -- For complex responses (multiple selections, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_questions_order ON survey_questions(order_index);
CREATE INDEX IF NOT EXISTS idx_survey_participants_user_id ON survey_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_participants_status ON survey_participants(status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_participant_id ON survey_responses(participant_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Surveys: Everyone can read active surveys
CREATE POLICY "Anyone can view active surveys" ON surveys
  FOR SELECT USING (is_active = true);

-- Survey questions: Everyone can read questions for active surveys
CREATE POLICY "Anyone can view questions for active surveys" ON survey_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = survey_questions.survey_id 
      AND surveys.is_active = true
    )
  );

-- Survey participants: Users can only see their own participation
CREATE POLICY "Users can view their own participation" ON survey_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participation" ON survey_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" ON survey_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Survey responses: Users can only see and modify their own responses
CREATE POLICY "Users can view their own responses" ON survey_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM survey_participants 
      WHERE survey_participants.id = survey_responses.participant_id 
      AND survey_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own responses" ON survey_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM survey_participants 
      WHERE survey_participants.id = survey_responses.participant_id 
      AND survey_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own responses" ON survey_responses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM survey_participants 
      WHERE survey_participants.id = survey_responses.participant_id 
      AND survey_participants.user_id = auth.uid()
    )
  );

-- Insert the main survey
INSERT INTO surveys (id, title, description, is_active) 
VALUES (
  'mipymes-diagnostico'::uuid, 
  'Diagnóstico del Ecosistema Empresarial MIPYMES',
  'Encuesta para evaluar el estado del ecosistema empresarial MIPYMES en Ecuador',
  true
) ON CONFLICT (id) DO NOTHING;