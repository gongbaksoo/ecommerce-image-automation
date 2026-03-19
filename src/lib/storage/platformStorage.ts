import { v4 as uuidv4 } from 'uuid';
import type { Platform, ImageSpec } from '@/types';

const STORAGE_KEY = 'ecommerce-image-platforms';

export function loadPlatforms(): Platform[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Platform[];
  } catch {
    return [];
  }
}

export function savePlatforms(platforms: Platform[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
}

export function addPlatform(name: string): Platform {
  const platforms = loadPlatforms();
  const now = new Date().toISOString();
  const newPlatform: Platform = {
    id: uuidv4(),
    name,
    imageSpecs: [],
    createdAt: now,
    updatedAt: now,
  };
  platforms.push(newPlatform);
  savePlatforms(platforms);
  return newPlatform;
}

export function updatePlatform(id: string, data: Partial<Pick<Platform, 'name'>>): void {
  const platforms = loadPlatforms();
  const index = platforms.findIndex((p) => p.id === id);
  if (index === -1) return;
  platforms[index] = {
    ...platforms[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  savePlatforms(platforms);
}

export function deletePlatform(id: string): void {
  const platforms = loadPlatforms().filter((p) => p.id !== id);
  savePlatforms(platforms);
}

export function addImageSpec(
  platformId: string,
  spec: Omit<ImageSpec, 'id'>
): ImageSpec | null {
  const platforms = loadPlatforms();
  const platform = platforms.find((p) => p.id === platformId);
  if (!platform) return null;
  const newSpec: ImageSpec = { id: uuidv4(), ...spec };
  platform.imageSpecs.push(newSpec);
  platform.updatedAt = new Date().toISOString();
  savePlatforms(platforms);
  return newSpec;
}

export function updateImageSpec(
  platformId: string,
  specId: string,
  data: Partial<Omit<ImageSpec, 'id'>>
): void {
  const platforms = loadPlatforms();
  const platform = platforms.find((p) => p.id === platformId);
  if (!platform) return;
  const specIndex = platform.imageSpecs.findIndex((s) => s.id === specId);
  if (specIndex === -1) return;
  platform.imageSpecs[specIndex] = { ...platform.imageSpecs[specIndex], ...data };
  platform.updatedAt = new Date().toISOString();
  savePlatforms(platforms);
}

export function deleteImageSpec(platformId: string, specId: string): void {
  const platforms = loadPlatforms();
  const platform = platforms.find((p) => p.id === platformId);
  if (!platform) return;
  platform.imageSpecs = platform.imageSpecs.filter((s) => s.id !== specId);
  platform.updatedAt = new Date().toISOString();
  savePlatforms(platforms);
}
