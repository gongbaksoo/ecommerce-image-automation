'use client';

import { EditorProvider } from '@/contexts/EditorContext';
import EditorMain from '@/components/editor/EditorMain';

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorMain />
    </EditorProvider>
  );
}
