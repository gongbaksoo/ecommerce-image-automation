const STORAGE_KEY = 'ecommerce-image-api-settings';

export interface GeminiModel {
  id: string;
  name: string;
  description: string;
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash Experimental',
    description: '추천 — 무료 API 키로 이미지 생성 가능',
  },
  {
    id: 'gemini-2.0-flash-preview-image-generation',
    name: 'Gemini 2.0 Flash Image Generation',
    description: '이미지 생성 특화 (유료 플랜 필요할 수 있음)',
  },
  {
    id: 'imagen-3.0-generate-002',
    name: 'Imagen 3.0',
    description: '최고 품질 이미지 생성 (유료 플랜 필요)',
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
