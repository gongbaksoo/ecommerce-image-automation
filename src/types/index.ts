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
/** 텍스트 배경 설정 */
export interface TextBg {
  type: 'none' | 'solid' | 'gradient' | 'blur';
  color: string;              // 단색 배경색 or 그라데이션 시작색
  opacity: number;            // 0~1
  padding: number;            // px
  borderRadius: number;       // px
  gradientEndColor: string;   // 그라데이션 끝색
  gradientDirection: 'to right' | 'to bottom' | 'to left' | 'to top';
  blurAmount: number;         // blur px
}

export const DEFAULT_TEXT_BG: TextBg = {
  type: 'none',
  color: '#000000',
  opacity: 0.5,
  padding: 8,
  borderRadius: 4,
  gradientEndColor: '#000000',
  gradientDirection: 'to right',
  blurAmount: 8,
};

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

/** 문구 배치 위치 프리셋 */
export type HeroContentLayout =
  | 'text-top'       // 문구 상단
  | 'text-center'    // 문구 중앙
  | 'text-bottom'    // 문구 하단
  | 'text-left';     // 문구 좌측

/** 문구 배치 위치별 라벨 */
export const HERO_CONTENT_LAYOUT_LABELS: Record<HeroContentLayout, string> = {
  'text-top': '상단 문구',
  'text-center': '중앙 문구',
  'text-bottom': '하단 문구',
  'text-left': '좌측 문구',
};

/** 문구 위치별 상품 배치 가이드 (AI 프롬프트용) */
export const TEXT_POSITION_PRODUCT_GUIDE: Record<HeroContentLayout, string> = {
  'text-top': 'Place the main product in the lower-center area, AVOIDING the top 30% where text will be overlaid. The background scene itself should fill the ENTIRE image naturally — do NOT leave blank or empty space anywhere.',
  'text-center': 'Place the main product slightly off-center or toward the bottom, AVOIDING the center area where text will be overlaid. The background scene itself should fill the ENTIRE image naturally — do NOT leave blank or empty space anywhere.',
  'text-bottom': 'Place the main product in the upper-center area, AVOIDING the bottom 30% where text will be overlaid. The background scene itself should fill the ENTIRE image naturally — do NOT leave blank or empty space anywhere.',
  'text-left': 'Place the main product on the right side, AVOIDING the left 40% where text will be overlaid. The background scene itself should fill the ENTIRE image naturally — do NOT leave blank or empty space anywhere.',
};

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
  heroContentLayout: HeroContentLayout;

  // Step 2: 콘텐츠
  heroSubText1: string;
  heroSubText1Style: TextStyle;
  heroTitle: string;
  heroTitleStyle: TextStyle;
  heroSubText2: string;
  heroSubText2Style: TextStyle;
  heroSubText3: string;
  heroTextBg: TextBg;  // 문구 영역 통합 배경
  heroSubText3Style: TextStyle;
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
  bgProductImage: File | null;
  bgProductImagePreview: string;
  bgSubImages: (File | null)[];
  bgSubImagePreviews: string[];
  bgReferenceImage: File | null;
  bgReferenceImagePreview: string;
  bgCropX: number;          // 0~100 (%)
  bgCropY: number;          // 0~100 (%)
  bgCropZoom: number;       // 1~3 (배율)
  bgImageNatW: number;      // 원본 이미지 너비
  bgImageNatH: number;      // 원본 이미지 높이

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

/** 기본 메인 문구 스타일 */
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'sans-serif',
  fontSize: 32,
  fontWeight: 700,
  color: '#ffffff',
  textAlign: 'center',
};

/** 기본 서브 문구 스타일 */
export const DEFAULT_SUB_TEXT_STYLE: TextStyle = {
  fontFamily: 'sans-serif',
  fontSize: 18,
  fontWeight: 400,
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
