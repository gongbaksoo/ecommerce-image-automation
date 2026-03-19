/** 이미지 종류별 규격 */
export interface ImageSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
  fileFormat: 'png' | 'jpg';
  maxFileSize?: number; // KB
}

/** 쇼핑몰 정보 (사용자 등록/관리) */
export interface Platform {
  id: string;
  name: string;
  imageSpecs: ImageSpec[];
  createdAt: string;
  updatedAt: string;
}

/** 개별 상품 정보 */
export interface ProductItem {
  id: string;
  image: File | null;
  imagePreview: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
}

/** 텍스트 스타일 설정 */
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

/** 폰트 설정 */
export interface FontConfig {
  family: string;
  isCustom: boolean;
  file?: File;
  url?: string;
}

/** 레이아웃 유형 */
export type LayoutType = 'hero-only' | 'products-only' | 'hero-products';

/** 레이아웃 유형 라벨 */
export const LAYOUT_LABELS: Record<LayoutType, string> = {
  'hero-only': '히어로만 (배너용)',
  'products-only': '상품만 (썸네일용)',
  'hero-products': '히어로 + 상품 (기획전용)',
};

/** 편집기 전체 상태 */
export interface EditorState {
  // Step 1: 규격 선택 (1개)
  selectedPlatformId: string | null;
  selectedImageSpecId: string | null;

  // Step 1.5: 레이아웃 유형
  layoutType: LayoutType;

  // Step 2: 콘텐츠
  heroTitle: string;
  heroTitleStyle: TextStyle;
  heroImage: File | null;
  heroImagePreview: string;
  products: ProductItem[];
  productColumns: 1 | 2 | 3;
  productNameStyle: TextStyle;
  productDescStyle: TextStyle;
  productPriceStyle: TextStyle;

  // Step 3: 배경
  backgroundType: 'ai' | 'upload' | 'color';
  backgroundColor: string;
  backgroundImage: string | null;
  aiPrompt: string;
  referenceImage: File | null;

  // 폰트
  fonts: FontConfig[];
  selectedFont: string;
}

/** AI 배경 생성 요청 */
export interface GenerateBackgroundRequest {
  prompt: string;
  referenceImage?: string;
  width: number;
  height: number;
}

/** AI 배경 생성 응답 */
export interface GenerateBackgroundResponse {
  imageUrl: string;
  error?: string;
}

/** 이미지 내보내기 결과 */
export interface ExportResult {
  platformId: string;
  platformName: string;
  imageSpecId: string;
  imageSpecName: string;
  width: number;
  height: number;
  blob: Blob;
  fileName: string;
}

/** 기본 텍스트 스타일 */
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'sans-serif',
  fontSize: 32,
  fontWeight: 700,
  color: '#ffffff',
  textAlign: 'center',
};

/** 기본 상품명 스타일 */
export const DEFAULT_PRODUCT_NAME_STYLE: TextStyle = {
  fontFamily: 'sans-serif',
  fontSize: 16,
  fontWeight: 600,
  color: '#333333',
  textAlign: 'center',
};

/** 기본 구성 설명 스타일 */
export const DEFAULT_PRODUCT_DESC_STYLE: TextStyle = {
  fontFamily: 'sans-serif',
  fontSize: 13,
  fontWeight: 400,
  color: '#666666',
  textAlign: 'center',
};

/** 기본 가격 스타일 */
export const DEFAULT_PRODUCT_PRICE_STYLE: TextStyle = {
  fontFamily: 'sans-serif',
  fontSize: 18,
  fontWeight: 700,
  color: '#e53e3e',
  textAlign: 'center',
};
