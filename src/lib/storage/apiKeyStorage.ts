const STORAGE_KEY = 'ecommerce-image-api-keys';

interface ApiKeys {
  geminiApiKey: string;
}

export function loadApiKeys(): ApiKeys {
  if (typeof window === 'undefined') return { geminiApiKey: '' };
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { geminiApiKey: '' };
  try {
    return JSON.parse(data) as ApiKeys;
  } catch {
    return { geminiApiKey: '' };
  }
}

export function saveApiKeys(keys: ApiKeys): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function getGeminiApiKey(): string {
  return loadApiKeys().geminiApiKey;
}

export function setGeminiApiKey(key: string): void {
  const keys = loadApiKeys();
  keys.geminiApiKey = key;
  saveApiKeys(keys);
}
