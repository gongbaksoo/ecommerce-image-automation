const STORAGE_KEY = 'ecommerce-image-api-settings';

export interface GeminiModel {
  id: string;
  name: string;
  description: string;
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash (Experimental)',
    description: '빠른 이미지 생성, 실험적 기능',
  },
  {
    id: 'gemini-2.0-flash-preview-image-generation',
    name: 'Gemini 2.0 Flash (Image Gen Preview)',
    description: '이미지 생성 특화 프리뷰 모델',
  },
  {
    id: 'gemini-2.5-flash-preview-native-audio-dialog',
    name: 'Gemini 2.5 Flash Preview',
    description: '최신 2.5 모델 (이미지 생성 지원 시)',
  },
  {
    id: 'imagen-3.0-generate-002',
    name: 'Imagen 3.0',
    description: '고품질 이미지 생성 전용 모델',
  },
];

interface ApiSettings {
  geminiApiKey: string;
  geminiModel: string;
}

const DEFAULT_SETTINGS: ApiSettings = {
  geminiApiKey: '',
  geminiModel: 'gemini-2.0-flash-exp',
};

export function loadApiSettings(): ApiSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveApiSettings(settings: ApiSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getGeminiApiKey(): string {
  return loadApiSettings().geminiApiKey;
}

export function getGeminiModel(): string {
  return loadApiSettings().geminiModel;
}
