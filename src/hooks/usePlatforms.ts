'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Platform, ImageSpec } from '@/types';
import * as storage from '@/lib/storage/platformStorage';

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setPlatforms(storage.loadPlatforms());
    setIsLoaded(true);
  }, []);

  const reload = useCallback(() => {
    setPlatforms(storage.loadPlatforms());
  }, []);

  const addPlatform = useCallback((name: string) => {
    const newPlatform = storage.addPlatform(name);
    setPlatforms(storage.loadPlatforms());
    return newPlatform;
  }, []);

  const updatePlatform = useCallback((id: string, data: Partial<Pick<Platform, 'name'>>) => {
    storage.updatePlatform(id, data);
    setPlatforms(storage.loadPlatforms());
  }, []);

  const deletePlatform = useCallback((id: string) => {
    storage.deletePlatform(id);
    setPlatforms(storage.loadPlatforms());
  }, []);

  const addImageSpec = useCallback((platformId: string, spec: Omit<ImageSpec, 'id'>) => {
    const newSpec = storage.addImageSpec(platformId, spec);
    setPlatforms(storage.loadPlatforms());
    return newSpec;
  }, []);

  const updateImageSpec = useCallback(
    (platformId: string, specId: string, data: Partial<Omit<ImageSpec, 'id'>>) => {
      storage.updateImageSpec(platformId, specId, data);
      setPlatforms(storage.loadPlatforms());
    },
    []
  );

  const deleteImageSpec = useCallback((platformId: string, specId: string) => {
    storage.deleteImageSpec(platformId, specId);
    setPlatforms(storage.loadPlatforms());
  }, []);

  return {
    platforms,
    isLoaded,
    reload,
    addPlatform,
    updatePlatform,
    deletePlatform,
    addImageSpec,
    updateImageSpec,
    deleteImageSpec,
  };
}
