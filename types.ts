export enum ViewState {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  RESULTS = 'RESULTS',
  HOW_IT_WORKS = 'HOW_IT_WORKS'
}

export enum ExplanationStyle {
  SIMPLE_30_SEC = '30_second_summary',
  ELI5 = 'explain_like_im_5',
  ACTION_ONLY = 'action_items_only'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface AnalysisResult {
  meaning: string;
  actions: string[];
  riskLevel: RiskLevel;
  riskReason: string;
}

export interface DocumentInputState {
  text: string;
  file: File | null;
  fileBase64: string | null;
  style: ExplanationStyle;
}