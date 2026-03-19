const STORAGE_KEY = 'ecommerce-image-api-settings';

export interface GeminiModel {
  id: string;
  name: string;
  description: string;
}

// 이미지 생성(responseModalities: IMAGE)을 지원하는 모델만 포함
// 안정 버전(gemini-2.0-flash 등)은 이미지 생성을 지원하지 않음
export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash Exp (추천)',
    description: '무료 API 키로 이미지 생성 가능. 실험적 모델.',
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
