
export interface GlossaryTerm {
  termAr: string;
  termEn: string;
  definition: string;
  theory: string;
  sinaiExample: string;
  impact: string;
  application: string;
}

export interface CaseStudy {
  id: string;
  scenario: string;
  questions: string[];
  targetSkill: string;
  expertAnalysis: {
    theory: string;
    sinaiInsight: string;
    practicalSolution: string;
  };
}

export interface Question {
  id: string;
  unit: number;
  question: string;
  options: string[];
  answer: string;
  explanation: {
    theory: string;
    sinaiLink: string;
    detailedExample: string;
    implications: string;
    applications: string;
  };
}

export interface UnitData {
  id: number;
  title: string;
  objectives: string[];
  weeklyPlan: { week: number; topic: string; activity: string; localExample: string }[];
  glossary: GlossaryTerm[];
  questions: Question[];
  cases: CaseStudy[];
  scenarioMCQs: Question[];
  assessment: { method: string; weight: number }[];
}

export enum AppState {
  HOME = 'HOME',
  UNIT_VIEW = 'UNIT_VIEW',
  FULL_EXAM = 'FULL_EXAM'
}

export type SubTab = 'INFO' | 'GLOSSARY' | 'PRACTICE' | 'CASES' | 'QUIZ';
