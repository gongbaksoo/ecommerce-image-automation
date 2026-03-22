'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import type {
  EditorState,
  TextStyle,
  ProductItem,
  FontConfig,
  LayoutType,
  HeroContentLayout,
} from '@/types';
import {
  DEFAULT_TEXT_STYLE,
  DEFAULT_PRODUCT_NAME_STYLE,
  DEFAULT_PRODUCT_DESC_STYLE,
  DEFAULT_PRODUCT_PRICE_STYLE,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

const initialState: EditorState = {
  selectedPlatformId: null,
  selectedImageSpecId: null,
  layoutType: 'hero-products',
  heroContentLayout: 'text-top',
  heroTitle: '',
  heroTitleStyle: DEFAULT_TEXT_STYLE,
  products: [],
  productColumns: 3,
  productNameStyle: DEFAULT_PRODUCT_NAME_STYLE,
  productDescStyle: DEFAULT_PRODUCT_DESC_STYLE,
  productPriceStyle: DEFAULT_PRODUCT_PRICE_STYLE,
  backgroundType: 'color',
  backgroundColor: '#1a1a2e',
  backgroundImage: null,
  aiPrompt: '',
  bgProductImage: null,
  bgProductImagePreview: '',
  bgSubImages: [null, null, null],
  bgSubImagePreviews: ['', '', ''],
  bgReferenceImage: null,
  bgReferenceImagePreview: '',
  fonts: [],
  selectedFont: 'sans-serif',
};

type Action =
  | { type: 'SELECT_PLATFORM'; platformId: string | null }
  | { type: 'SELECT_IMAGE_SPEC'; specId: string | null }
  | { type: 'SET_LAYOUT_TYPE'; layoutType: LayoutType }
  | { type: 'SET_HERO_CONTENT_LAYOUT'; layout: HeroContentLayout }
  | { type: 'SET_HERO_TITLE'; title: string }
  | { type: 'SET_HERO_TITLE_STYLE'; style: Partial<TextStyle> }
  | { type: 'ADD_PRODUCT' }
  | { type: 'UPDATE_PRODUCT'; id: string; data: Partial<ProductItem> }
  | { type: 'REMOVE_PRODUCT'; id: string }
  | { type: 'SET_PRODUCT_COLUMNS'; columns: 1 | 2 | 3 }
  | { type: 'SET_PRODUCT_NAME_STYLE'; style: Partial<TextStyle> }
  | { type: 'SET_PRODUCT_DESC_STYLE'; style: Partial<TextStyle> }
  | { type: 'SET_PRODUCT_PRICE_STYLE'; style: Partial<TextStyle> }
  | { type: 'SET_BACKGROUND_TYPE'; bgType: 'ai' | 'upload' | 'color' }
  | { type: 'SET_BACKGROUND_COLOR'; color: string }
  | { type: 'SET_BACKGROUND_IMAGE'; url: string | null }
  | { type: 'SET_AI_PROMPT'; prompt: string }
  | { type: 'SET_BG_PRODUCT_IMAGE'; file: File | null; preview: string }
  | { type: 'SET_BG_SUB_IMAGE'; index: number; file: File | null; preview: string }
  | { type: 'SET_BG_REFERENCE_IMAGE'; file: File | null; preview: string }
  | { type: 'ADD_FONT'; font: FontConfig }
  | { type: 'SELECT_FONT'; family: string };

function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'SELECT_PLATFORM':
      return { ...state, selectedPlatformId: action.platformId, selectedImageSpecId: null };
    case 'SELECT_IMAGE_SPEC':
      return { ...state, selectedImageSpecId: action.specId };
    case 'SET_LAYOUT_TYPE':
      return { ...state, layoutType: action.layoutType };
    case 'SET_HERO_CONTENT_LAYOUT':
      return { ...state, heroContentLayout: action.layout };
    case 'SET_HERO_TITLE':
      return { ...state, heroTitle: action.title };
    case 'SET_HERO_TITLE_STYLE':
      return { ...state, heroTitleStyle: { ...state.heroTitleStyle, ...action.style } };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [
          ...state.products,
          {
            id: uuidv4(),
            image: null,
            imagePreview: '',
            name: '',
            description: '',
            originalPrice: 0,
            salePrice: 0,
          },
        ],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.id ? { ...p, ...action.data } : p
        ),
      };
    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };
    case 'SET_PRODUCT_COLUMNS':
      return { ...state, productColumns: action.columns };
    case 'SET_PRODUCT_NAME_STYLE':
      return { ...state, productNameStyle: { ...state.productNameStyle, ...action.style } };
    case 'SET_PRODUCT_DESC_STYLE':
      return { ...state, productDescStyle: { ...state.productDescStyle, ...action.style } };
    case 'SET_PRODUCT_PRICE_STYLE':
      return { ...state, productPriceStyle: { ...state.productPriceStyle, ...action.style } };
    case 'SET_BACKGROUND_TYPE':
      return { ...state, backgroundType: action.bgType };
    case 'SET_BACKGROUND_COLOR':
      return { ...state, backgroundColor: action.color };
    case 'SET_BACKGROUND_IMAGE':
      return { ...state, backgroundImage: action.url };
    case 'SET_AI_PROMPT':
      return { ...state, aiPrompt: action.prompt };
    case 'SET_BG_PRODUCT_IMAGE':
      return { ...state, bgProductImage: action.file, bgProductImagePreview: action.preview };
    case 'SET_BG_SUB_IMAGE': {
      const newSubImages = [...state.bgSubImages];
      const newSubPreviews = [...state.bgSubImagePreviews];
      newSubImages[action.index] = action.file;
      newSubPreviews[action.index] = action.preview;
      return { ...state, bgSubImages: newSubImages, bgSubImagePreviews: newSubPreviews };
    }
    case 'SET_BG_REFERENCE_IMAGE':
      return { ...state, bgReferenceImage: action.file, bgReferenceImagePreview: action.preview };
    case 'ADD_FONT':
      return { ...state, fonts: [...state.fonts, action.font] };
    case 'SELECT_FONT':
      return { ...state, selectedFont: action.family };
    default:
      return state;
  }
}

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
