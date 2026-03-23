# E-commerce Event Image Generator Design Document

> **Summary**: HTML/CSS + Gemini AI 배경 기반 이커머스 행사 이미지 자동 생성 웹 앱 상세 설계
>
> **Project**: E-commerce Image Automation
> **Version**: 0.1.0
> **Author**: jeongjihye
> **Date**: 2026-03-18
> **Status**: Draft
> **Planning Doc**: [ecommerce-event-image-generator.plan.md](../../01-plan/features/ecommerce-event-image-generator.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. 사용자가 쇼핑몰과 이미지 종류를 선택하면 규격이 자동 적용되는 직관적 워크플로
2. HTML/CSS 기반 렌더링으로 한글 문구/가격 정보의 정밀한 타이포그래피 제어
3. Gemini AI는 배경 이미지 생성에만 사용하고, 텍스트는 100% HTML/CSS로 처리
4. 쇼핑몰/이미지 규격 데이터를 사용자가 직접 관리 (웹 화면에서 입력/수정/삭제, localStorage 저장)

### 1.2 Design Principles

- **관심사 분리**: 쇼핑몰 규격 데이터 / 이미지 렌더링 로직 / UI 컴포넌트 분리
- **사용자 주도 규격 관리**: 쇼핑몰/이미지 종류/규격을 사용자가 직접 등록·수정 (하드코딩 없음)
- **클라이언트 우선**: 이미지 합성은 브라우저에서 처리, 서버는 AI 배경 생성만 담당
- **로컬 영속성**: localStorage로 규격 데이터와 설정을 브라우저에 저장 (DB 불필요)

---

## 2. Architecture

### 2.1 Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser (Client)                           │
│                                                               │
│  ┌─────────────────┐                                         │
│  │ Platform        │  쇼핑몰/이미지 규격 관리 페이지 (/settings) │
│  │ Manager Page    │  (CRUD: 쇼핑몰 추가, 이미지 종류/규격 등록) │
│  └────────┬────────┘                                         │
│           │ 저장/로드                                         │
│           ▼                                                   │
│  ┌──────────────┐                                            │
│  │ localStorage │ ← 쇼핑몰 규격 데이터 영속 저장              │
│  └──────┬───────┘                                            │
│         │ 로드                                                │
│         ▼                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │ Platform     │  │ Editor       │  │ Export        │       │
│  │ Selector     │→ │ (HTML/CSS    │→ │ Engine        │       │
│  │              │  │  Preview)    │  │ (html2canvas) │       │
│  └──────────────┘  └──────────────┘  └───────────────┘       │
│                           ↑                   │               │
│                           │                   ▼               │
│                    ┌──────────────┐  ┌───────────────┐       │
│                    │ Font         │  │ Download      │       │
│                    │ Manager      │  │ Manager (ZIP) │       │
│                    └──────────────┘  └───────────────┘       │
│                                                               │
└──────────────────────────┬────────────────────────────────────┘
                           │ API Call
                           ▼
              ┌─────────────────────────┐
              │   Next.js API Routes    │
              │  POST /api/generate-bg  │
              │  (Gemini API Proxy)     │
              └─────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │     Gemini API          │
              │  (배경 이미지 생성만)    │
              └─────────────────────────┘
```

### 2.2 Data Flow

```
[0. 규격 관리 (사전 설정, /settings 페이지)]
  사용자가 쇼핑몰 추가 → 이미지 종류/규격(px) 등록 → localStorage에 저장
  (최초 1회 설정 후 반복 사용. 언제든 수정/추가/삭제 가능)
       │
       ▼
[1. 규격 선택 (편집기 페이지, 1개 선택)]
  localStorage에서 규격 데이터 로드 → 쇼핑몰 1개 선택 → 이미지 종류 1개 선택 → 규격 자동 적용
  ※ 다른 규격이 필요하면 규격만 변경 후 재생성 (콘텐츠는 유지)
       │
       ▼
[1.5. 레이아웃 유형 선택]
  히어로만(배너용) / 상품만(썸네일용) / 히어로+상품(기획전용) 중 선택
       │
       ▼
[2. 콘텐츠 입력]
  메인 문구 + 메인 상품 이미지 + 서브 이미지(최대 3개) + 개별 상품(이미지/이름/구성/가격) + 폰트 + 열 수 + (레퍼런스)
       │
       ▼
[3. AI 배경 생성 (선택)]
  메인 상품 이미지 + 서브 이미지(최대 3개) + 프롬프트 + 문구 위치 가이드 + 레퍼런스 → API Route → Gemini API → 상품이 포함된 배경 이미지 URL 반환
  ※ AI는 문구 배치 위치(상단/중앙/하단/좌측)를 피해 상품을 배치
       │
       ▼
[4. HTML/CSS 실시간 미리보기]
  선택된 규격 크기의 div 안에 배경 + 상품 + 텍스트 레이어를 HTML/CSS로 합성
       │
       ▼
[5. 이미지 생성]
  html2canvas로 미리보기 영역을 캡처 → 선택한 쇼핑몰/이미지 종류별로 각각 생성
       │
       ▼
[6. 다운로드]
  개별 PNG 다운로드 or JSZip으로 일괄 ZIP 다운로드
```

### 2.3 Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| next | App Router 프레임워크 | ^15 |
| react / react-dom | UI 라이브러리 | ^19 |
| typescript | 타입 안전성 | ^5 |
| tailwindcss | 스타일링 | ^4 |
| html2canvas | HTML→이미지 변환 | ^1.4 |
| jszip | ZIP 파일 생성 | ^3.10 |
| file-saver | 파일 다운로드 | ^2.0 |
| @google/generative-ai | Gemini API 클라이언트 | latest |

---

## 3. Data Model

### 3.1 Core Types

```typescript
// ========== 쇼핑몰 규격 관련 ==========

/** 이미지 종류별 규격 */
interface ImageSpec {
  id: string;                  // 자동 생성 UUID
  name: string;                // 예: '메인 배너', '상품 썸네일'
  width: number;               // px
  height: number;              // px
  description: string;         // 용도 설명
  fileFormat: 'png' | 'jpg';   // 출력 형식
  maxFileSize?: number;        // KB (쇼핑몰 제한이 있는 경우)
}

/** 쇼핑몰 정보 (사용자가 등록/관리) */
interface Platform {
  id: string;                  // 자동 생성 UUID
  name: string;                // 사용자 입력: '쿠팡', '11번가' 등
  imageSpecs: ImageSpec[];     // 사용자가 등록한 이미지 종류/규격 목록
  createdAt: string;           // ISO 날짜
  updatedAt: string;           // ISO 날짜
}

/** localStorage 저장 키 */
// 'ecommerce-image-platforms' → Platform[]
// 'ecommerce-image-api-settings' → { geminiApiKey: string, geminiModel: string }

// ========== 편집기 상태 관련 ==========

/** 개별 상품 정보 */
interface ProductItem {
  id: string;
  image: File | null;          // 상품 이미지
  imagePreview: string;        // 미리보기 URL (createObjectURL)
  name: string;                // 상품명
  description: string;         // 구성 설명
  originalPrice: number;       // 원가
  salePrice: number;           // 할인가
}

/** 폰트 설정 */
interface FontConfig {
  family: string;              // 폰트 패밀리명
  isCustom: boolean;           // 커스텀 업로드 폰트 여부
  file?: File;                 // 업로드된 폰트 파일
  url?: string;                // 로드된 폰트 URL (createObjectURL)
}

/** 텍스트 스타일 설정 */
interface TextStyle {
  fontFamily: string;
  fontSize: number;            // px
  fontWeight: number;          // 400, 700 등
  color: string;               // hex
  textAlign: 'left' | 'center' | 'right';
}

/** 레이아웃 유형 */
type LayoutType = 'hero-only' | 'products-only' | 'hero-products';

/** 편집기 전체 상태 */
interface EditorState {
  // Step 1: 규격 선택 (1개씩)
  selectedPlatformId: string | null;    // 선택된 쇼핑몰
  selectedImageSpecId: string | null;   // 선택된 이미지 종류

  // Step 1.5: 레이아웃 유형
  layoutType: LayoutType;               // 'hero-only' | 'products-only' | 'hero-products'
  heroContentLayout: HeroContentLayout; // 문구 배치 위치 ('text-top' | 'text-center' | 'text-bottom' | 'text-left')

  // Step 2: 콘텐츠
  heroSubText1: string;                 // 서브 문구 1 (메인 문구 위)
  heroSubText1Style: TextStyle;
  heroTitle: string;                    // 행사 메인 문구
  heroTitleStyle: TextStyle;            // 메인 문구 스타일
  heroSubText2: string;                 // 서브 문구 2 (메인 문구 아래)
  heroSubText2Style: TextStyle;
  heroSubText3: string;                 // 서브 문구 3 (서브 문구 2 아래)
  heroSubText3Style: TextStyle;
  heroTextBg: TextBg;                   // 문구 영역 통합 배경 (단색/그라데이션/블러)
  products: ProductItem[];              // 행사 상품 목록
  productColumns: 1 | 2 | 3;           // 하단 상품 열 수
  productNameStyle: TextStyle;          // 상품명 스타일
  productDescStyle: TextStyle;          // 구성 설명 스타일
  productPriceStyle: TextStyle;         // 가격 스타일

  // Step 3: 배경
  backgroundType: 'ai' | 'upload' | 'color';
  backgroundColor: string;             // 배경색 (hex)
  backgroundImage: string | null;      // AI 생성 or 업로드 배경 이미지 URL
  aiPrompt: string;                    // AI 배경 생성 프롬프트
  bgProductImage: File | null;         // 메인 상품 이미지 (AI 배경에 포함)
  bgProductImagePreview: string;
  bgSubImages: (File | null)[];        // 서브 이미지 (최대 3개, AI 배경에 포함)
  bgSubImagePreviews: string[];
  bgReferenceImage: File | null;       // 레퍼런스 이미지 (스타일 참고용)
  bgReferenceImagePreview: string;
  bgCropX: number;                     // 크롭 위치 X (0~100%)
  bgCropY: number;                     // 크롭 위치 Y (0~100%)
  bgCropZoom: number;                  // 크롭 줌 배율 (1~3)

  // 폰트
  fonts: FontConfig[];                 // 사용 가능한 폰트 목록
  selectedFont: string;                // 현재 선택된 폰트 패밀리
}

// ========== API 관련 ==========

/** AI 배경 생성 요청 */
interface GenerateBackgroundRequest {
  prompt: string;
  referenceImage?: string;             // base64
  width: number;
  height: number;
}

/** AI 배경 생성 응답 */
interface GenerateBackgroundResponse {
  imageUrl: string;                    // 생성된 배경 이미지 (base64 data URL)
  error?: string;
}

/** 이미지 내보내기 결과 */
interface ExportResult {
  platformId: string;
  platformName: string;
  imageSpecId: string;
  imageSpecName: string;
  width: number;
  height: number;
  blob: Blob;
  fileName: string;                    // 예: 'coupang_main-banner_780x400.png'
}
```

### 3.2 쇼핑몰 규격 데이터 (사용자 관리, localStorage 저장)

쇼핑몰 규격 데이터는 하드코딩하지 않습니다. 사용자가 `/settings` 페이지에서 직접 등록/수정/삭제하며, **localStorage**에 저장됩니다.

```typescript
// localStorage key: 'ecommerce-image-platforms'
// 저장 형태: JSON.stringify(Platform[])

// 사용자가 등록한 데이터 예시:
const platforms: Platform[] = [
  {
    id: 'uuid-1',
    name: '쿠팡',
    imageSpecs: [
      { id: 'spec-1', name: '메인 배너', width: 1240, height: 400, description: '기획전 메인', fileFormat: 'jpg' },
      { id: 'spec-2', name: '상품 썸네일', width: 500, height: 500, description: '상품 목록', fileFormat: 'jpg' },
    ],
    createdAt: '2026-03-18T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z',
  },
  {
    id: 'uuid-2',
    name: '11번가',
    imageSpecs: [
      { id: 'spec-3', name: '기획전 이미지', width: 890, height: 890, description: '기획전', fileFormat: 'jpg' },
    ],
    createdAt: '2026-03-18T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z',
  },
];
```

**localStorage CRUD 유틸 (`lib/storage/platformStorage.ts`)**:
```typescript
const STORAGE_KEY = 'ecommerce-image-platforms';

export function loadPlatforms(): Platform[]
export function savePlatforms(platforms: Platform[]): void
export function addPlatform(name: string): Platform
export function updatePlatform(id: string, data: Partial<Platform>): void
export function deletePlatform(id: string): void
export function addImageSpec(platformId: string, spec: Omit<ImageSpec, 'id'>): ImageSpec
export function updateImageSpec(platformId: string, specId: string, data: Partial<ImageSpec>): void
export function deleteImageSpec(platformId: string, specId: string): void
```

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/generate-background | Gemini AI 배경 이미지 생성 | API Key (클라이언트 전달) |
| POST | /api/list-models | 사용 가능한 Gemini 모델 목록 조회 | API Key (클라이언트 전달) |

> API 키는 사용자가 /settings 페이지에서 localStorage에 저장하고, API 호출 시 request body로 전달합니다.

### 4.2 Detailed Specification

#### `POST /api/generate-background`

Gemini API를 프록시하여 배경 이미지를 생성합니다. 클라이언트에서 API 키와 모델 ID를 전달합니다.
Gemini 모델은 `generateContent` + `responseModalities: ['IMAGE', 'TEXT']`를 사용하고,
Imagen 모델은 `predict` 엔드포인트를 사용합니다.

**Request:**
```json
{
  "prompt": "봄 분위기의 밝은 파스텔톤 행사 배경, 꽃잎과 리본 장식",
  "apiKey": "AIza...",
  "model": "gemini-2.0-flash-exp",
  "productImage": "data:image/png;base64,...",
  "subImage1": "data:image/png;base64,...",
  "subImage2": "data:image/png;base64,...",
  "subImage3": null,
  "referenceImage": "data:image/png;base64,...",
  "textPosition": "text-top",
  "textPositionGuide": "Place the product in the lower-center area. Keep the top 30% clear for text overlay.",
  "width": 1240,
  "height": 400
}
```

**Response (200 OK):**
```json
{
  "imageUrl": "data:image/png;base64,..."
}
```

**Error Responses:**
- `400 Bad Request`: prompt 누락 또는 유효하지 않은 이미지 데이터
- `429 Too Many Requests`: Gemini API 호출 제한 초과
- `500 Internal Server Error`: Gemini API 호출 실패

**구현 세부사항:**
```typescript
// app/api/generate-background/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { prompt, referenceImage, width, height } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  // 배경 이미지 생성 전용 프롬프트 구성
  const systemPrompt = `
    Create an event promotion background image.
    - Size: ${width}x${height}px
    - Style: Clean, professional e-commerce event banner background
    - DO NOT include any text or letters
    - Leave space for product images and text overlay
    User request: ${prompt}
  `;

  // Gemini 이미지 생성 API 호출
  // referenceImage가 있으면 스타일 참고용으로 전달
  // 응답을 base64 data URL로 변환하여 반환
}
```

---

## 5. UI/UX Design

### 5.1 페이지 구성

| 경로 | 페이지 | 역할 |
|------|--------|------|
| `/` | 편집기 페이지 | 행사 이미지 편집/생성/다운로드 (메인) |
| `/settings` | 쇼핑몰 규격 관리 페이지 | 쇼핑몰/이미지 종류/규격 CRUD |

### 5.2 쇼핑몰 규격 관리 페이지 (`/settings`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚙️ 쇼핑몰 이미지 규격 관리                     [← 편집기로 돌아가기] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [+ 쇼핑몰 추가]                                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 쿠팡                                          [수정][삭제] │     │
│  │                                                         │     │
│  │  이미지 종류:                          [+ 이미지 종류 추가] │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │ 메인 배너    │ 1240 × 400 │ JPG │ 기획전 메인   [✏️][🗑] │   │     │
│  │  │ 상품 썸네일  │  500 × 500 │ JPG │ 상품 목록    [✏️][🗑] │   │     │
│  │  │ 행사 배너    │  780 × 200 │ PNG │ 행사 상단    [✏️][🗑] │   │     │
│  │  └─────────────────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 11번가                                        [수정][삭제] │     │
│  │                                                         │     │
│  │  이미지 종류:                          [+ 이미지 종류 추가] │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │ 기획전 이미지 │ 890 × 890 │ JPG │ 기획전       [✏️][🗑] │   │     │
│  │  └─────────────────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ※ 등록한 규격은 브라우저에 자동 저장됩니다                          │
└──────────────────────────────────────────────────────────────────┘
```

**쇼핑몰 추가 모달:**
```
┌─────────────────────────────┐
│  쇼핑몰 추가                 │
│                              │
│  쇼핑몰 이름: [__________]   │
│                              │
│  [취소]  [추가]              │
└─────────────────────────────┘
```

**이미지 종류 추가/수정 모달:**
```
┌──────────────────────────────────┐
│  이미지 종류 추가                 │
│                                   │
│  이름:     [메인 배너_________]   │
│  너비(px): [1240__]              │
│  높이(px): [400___]              │
│  형식:     [JPG ▼]  (JPG/PNG)    │
│  설명:     [기획전 메인 배너___]  │
│  최대크기:  [1000__] KB (선택)    │
│                                   │
│  [취소]  [저장]                   │
└──────────────────────────────────┘
```

### 5.3 편집기 페이지 레이아웃 (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│  🎨 이커머스 행사 이미지 메이커                          [다크모드] │
├────────────────────────────────┬─────────────────────────────────┤
│                                │                                 │
│  [좌측] 설정 패널 (스크롤)      │  [우측] 실시간 미리보기           │
│                                │                                 │
│  ┌───────────────────────┐    │  ┌─────────────────────────┐    │
│  │ 1. 규격 선택 (1개)      │    │  │                         │    │
│  │ 쇼핑몰: [쿠팡 ▼]       │    │  │   선택한 규격 크기의     │    │
│  │ 이미지:  [메인배너 ▼]   │    │  │   실시간 미리보기       │    │
│  │ → 1240 × 400 px        │    │  │                         │    │
│  │                        │    │  │                         │    │
│  │ 등록된 쇼핑몰 없음 시:  │    │  │                         │    │
│  │ [⚙️ 쇼핑몰 규격 등록]   │    │  │                         │    │
│  └───────────────────────┘    │  │                         │    │
│  ┌───────────────────────┐    │  │  ┌───────────────────┐  │    │
│  │ 2. 레이아웃 유형        │    │  │  │ 🎉 행사 메인 문구  │  │    │
│  │ ○ 히어로만 (배너용)     │    │  │  │ [메인 연출 이미지]  │  │    │
│  │ ○ 상품만 (썸네일용)     │    │  │  ├───────────────────┤  │    │
│  │ ● 히어로+상품 (기획전)  │    │  │  │상품1│상품2│상품3│  │    │
│  └───────────────────────┘    │  │  │가격 │가격 │가격 │  │    │
│  ┌───────────────────────┐    │  │  └───────────────────┘  │    │
│  │ 3. 배경 & 레이아웃 설정  │    │  │                         │    │
│  │ 콘텐츠 배치:             │    │  └─────────────────────────┘    │
│  │ [상단][중앙][하단][좌측] │    │                                 │
│  │ ● AI 생성  ○ 업로드     │    │                                 │
│  │ ○ 단색                  │    │                                 │
│  │ [메인 상품 이미지 *]    │    │                                 │
│  │ [서브 이미지 1~3 선택]  │    │                                 │
│  │ [프롬프트 입력...]      │    │                                 │
│  │ [레퍼런스 이미지 업로드] │    │                                 │
│  │ [배경 생성하기]         │    │                                 │
│  └───────────────────────┘    │                                 │
│  ┌───────────────────────┐    │                                 │
│  │ 4. 메인 문구            │    │                                 │
│  │ [문구 입력...]          │    │                                 │
│  │ 폰트: [선택 ▼] [업로드] │    │                                 │
│  │ 크기: [48px] 색상: [#] │    │                                 │
│  └───────────────────────┘    │                                 │
│  ┌───────────────────────┐    │                                 │
│  │ 5. 행사 상품 목록       │    │                                 │
│  │ 열 수: [1열|2열|3열]   │    │                                 │
│  │                        │    │                                 │
│  │ ┌─ 상품 1 ──────────┐ │    │                                 │
│  │ │ [이미지] 상품명:   │ │    │                                 │
│  │ │ 구성: ______      │ │    │                                 │
│  │ │ 원가: ___  할인가: │ │    │                                 │
│  │ └──────────────────┘ │    │                                 │
│  │ [+ 상품 추가]         │    │                                 │
│  └───────────────────────┘    │                                 │
│                                │                                 │
│  ┌───────────────────────┐    │                                 │
│  │ [이미지 생성하기]       │    │                                 │
│  │ [다운로드]              │    │                                 │
│  └───────────────────────┘    │                                 │
│                                │                                 │
├────────────────────────────────┴─────────────────────────────────┤
│  Footer                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### 5.5 User Flow

```
앱 최초 진입
  │
  ├── 등록된 쇼핑몰 없음 → /settings로 이동 안내
  │     └── 쇼핑몰 추가 → 이미지 종류/규격 등록 → localStorage 저장
  │           └── 편집기(/)로 이동
  │
앱 진입 (규격 등록 완료 상태)
  │
  ├── Step 1: 규격 선택 (드롭다운, 1개씩)
  │     ├── 쇼핑몰 선택 (드롭다운)
  │     └── 이미지 종류 선택 (드롭다운) → 규격(px) 자동 표시
  │
  ├── Step 1.5: 레이아웃 유형 선택 (라디오)
  │     ├── 히어로만 (배너용) → 메인문구+연출이미지만 표시
  │     ├── 상품만 (썸네일용) → 상품 그리드만 표시
  │     └── 히어로+상품 (기획전) → 전체 2단 표시
  │
  ├── Step 2: 배경 & 레이아웃 설정
  │     ├── 문구 위치 선택: 상단/중앙/하단/좌측 프리셋
  │     ├── AI 생성:
  │     │     ├── 메인 상품 이미지 업로드 (필수)
  │     │     ├── 서브 이미지 1~3 업로드 (선택, 최대 3개)
  │     │     ├── 프롬프트 입력
  │     │     └── [배경 생성] → AI가 문구 위치를 피해 상품 배치한 배경 생성
  │     ├── 직접 업로드: 이미지 파일 업로드
  │     └── 단색: 색상 피커로 선택
  │
  ├── Step 3: 메인 문구 입력
  │     └── 텍스트 + 폰트/크기/색상 설정
  │
  ├── Step 4: 행사 상품 입력 (N개 반복)
  │     ├── 상품 이미지 업로드
  │     ├── 상품명 / 구성 설명 입력
  │     ├── 원가 / 할인가 입력
  │     └── [+ 상품 추가] / [삭제]
  │
  ├── Step 6: 열 수 선택 (1/2/3열)
  │
  ├── [미리보기] ← 모든 입력이 실시간 반영
  │     └── 쇼핑몰별 탭으로 각 규격 미리보기 전환
  │
  └── [이미지 생성하기] → 선택한 모든 규격으로 이미지 생성
        └── [전체 다운로드 ZIP] or 개별 다운로드
```

### 5.3 이미지 출력 레이아웃 (HTML/CSS 렌더링 영역)

```
┌─────────────────────────────────────────┐ ← 선택한 규격(예: 1240×400)
│ [Layer 1: 배경]                          │
│   AI 생성 or 업로드 or 단색              │
│                                          │
│ [Layer 2: 상단 히어로 영역]              │
│   ┌──────────────────────────────────┐  │
│   │  {행사 메인 문구}                 │  │
│   │  (HTML <h1>, CSS font-family,    │  │
│   │   font-size, color, text-shadow) │  │
│   │  (위치: 상단/중앙/하단/좌측)     │  │
│   └──────────────────────────────────┘  │
│                                          │
│ [Layer 3: 하단 상품 안내 영역]           │
│   ┌─────────┬─────────┬─────────┐      │
│   │ [상품1]  │ [상품2]  │ [상품3]  │      │ ← 3열 선택 시
│   │ img      │ img      │ img      │      │
│   │ 상품명   │ 상품명   │ 상품명   │      │
│   │ 구성설명 │ 구성설명 │ 구성설명 │      │
│   │ ~~원가~~ │ ~~원가~~ │ ~~원가~~ │      │
│   │ 할인가   │ 할인가   │ 할인가   │      │
│   └─────────┴─────────┴─────────┘      │
└─────────────────────────────────────────┘
```

**HTML/CSS 렌더링 핵심 원칙:**
- 렌더링 영역은 `position: relative`인 div, 선택된 규격 크기(px)로 고정
- 배경은 `background-image` + `background-size: cover`
- 텍스트는 모두 HTML 요소 (`<h1>`, `<p>`, `<span>`)로 렌더링
- 상품 그리드는 CSS Grid (`grid-template-columns: repeat(N, 1fr)`)
- 가격 취소선은 `text-decoration: line-through`
- 커스텀 폰트는 `@font-face`로 동적 로딩

### 5.7 Component List

| Component | Location | Responsibility | Status |
|-----------|----------|----------------|--------|
| `ApiKeyManager` | components/settings/ | API 키 입력 + 모델 조회/선택 | ✅ |
| `PlatformManager` | components/settings/ | 쇼핑몰 CRUD + 이미지 규격 CRUD (통합) | ✅ |
| `PlatformFormModal` | components/settings/ | 쇼핑몰 추가/수정 모달 | ✅ |
| `ImageSpecFormModal` | components/settings/ | 이미지 종류 추가/수정 모달 | ✅ |
| `PlatformSelector` | components/platform/ | 쇼핑몰/이미지 종류 드롭다운 + 레이아웃 유형 선택 | ✅ |
| `EditorMain` | components/editor/ | 편집기 전체 레이아웃 (좌측 설정 + 우측 미리보기) | ✅ |
| `HeroSection` | components/editor/ | 상단 히어로 렌더링 (문구 위치 배치: 상단/중앙/하단/좌측, flex 기반) | ✅ |
| `ProductGrid` | components/editor/ | 하단 상품 그리드 (1/2/3열, flex:1 + alignContent:end) | ✅ |
| `ProductCard` | components/editor/ | 개별 상품 카드 (이미지 maxHeight:120px + 텍스트) | ✅ |
| `PreviewPanel` | components/editor/ | 실시간 미리보기 (scale 기반 축소, renderRef 포함) | ✅ |
| `ImageUploader` | components/inputs/ | 드래그앤드롭/클릭 이미지 업로드 | ✅ |
| `TextInputForm` | components/inputs/ | 문구 입력 + 스타일(폰트/크기/색상) 설정 | ✅ |
| `ProductInputForm` | components/inputs/ | 상품 정보 입력 + 열 수 선택 (통합) | ✅ |
| `FontSelector` | components/inputs/ | 기본 폰트 선택 + 커스텀 폰트 업로드 (FontFace API) | ✅ |
| `BackgroundConfigurator` | components/inputs/ | 배경 설정 (단색/업로드/AI) + 문구 위치 프리셋 + 메인 상품/서브 이미지 + 모델 선택 + 레퍼런스 이미지 | ✅ |
| `BackgroundCropSelector` | components/inputs/ | AI 생성 배경 크롭 영역 선택 (드래그 이동 + 줌 100%~300%) | ✅ |
| `ExportButton` | components/export/ | 이미지 생성(html2canvas) + PNG/JPG 다운로드 | ✅ |
| `Button/Input/Modal/Toast/Navigation` | components/ui/ | 공통 UI 컴포넌트 | ✅ |

---

## 6. Error Handling

### 6.1 Error Scenarios

| Scenario | Cause | Handling |
|----------|-------|----------|
| AI 배경 생성 실패 | Gemini API 오류/타임아웃 | 에러 메시지 표시 + "직접 업로드" 대안 안내 |
| AI API 키 미설정 | 환경변수 누락 | "배경 업로드" 모드로 폴백, 설정 안내 |
| 이미지 업로드 실패 | 파일 형식/크기 초과 | 지원 형식(JPG/PNG/WebP) 및 최대 크기(10MB) 안내 |
| 폰트 로딩 실패 | 잘못된 폰트 파일 | 기본 폰트로 폴백 + 에러 메시지 |
| html2canvas 렌더링 오류 | 미지원 CSS 속성 | 단순 CSS만 사용하여 방지, 오류 시 재시도 안내 |
| ZIP 생성 실패 | 브라우저 메모리 부족 | 개별 다운로드 대안 안내 |

### 6.2 사용자 피드백

- **로딩 상태**: AI 배경 생성 중 스피너 + "배경 이미지를 만들고 있어요..." 메시지
- **진행률**: 이미지 생성 시 "3/8 이미지 생성 중..." 프로그레스바
- **성공**: 토스트 알림 "이미지 생성 완료!"
- **실패**: 인라인 에러 메시지 (빨간색) + 대안 액션 버튼

---

## 7. Security Considerations

- [x] Gemini API Key는 localStorage에 저장, API 호출 시 request body로 서버에 전달 (환경변수도 병행 지원)
- [x] 업로드 파일 형식 검증 (이미지: jpg/png/webp, 폰트: ttf/otf/woff2)
- [x] 업로드 파일 크기 제한 (이미지 10MB, 폰트 5MB)
- [ ] HTTPS 적용 (배포 시)
- [x] 사용자 업로드 파일은 서버에 저장하지 않음 (브라우저 메모리에서만 처리)
- [x] API 모델 목록 조회로 유효한 모델만 사용 가능

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Unit Test | 규격 데이터 로딩, 가격 포맷팅, 파일명 생성 | Vitest |
| Component Test | 편집기 컴포넌트 렌더링 | Vitest + Testing Library |
| E2E Test | 전체 이미지 생성 워크플로 | Playwright |

### 8.2 Test Cases (Key)

- [ ] 쇼핑몰 선택 시 해당 이미지 종류 목록이 정확히 표시되는지
- [ ] 이미지 종류 선택 시 미리보기 영역 크기가 규격에 맞게 변경되는지
- [ ] 상품 추가/삭제 시 미리보기가 실시간 업데이트되는지
- [ ] 열 수 변경(1/2/3) 시 그리드 레이아웃이 정확히 변경되는지
- [ ] 커스텀 폰트 업로드 후 미리보기에 반영되는지
- [ ] html2canvas로 생성된 이미지가 선택한 규격(px)과 정확히 일치하는지
- [ ] 여러 쇼핑몰/이미지 종류 선택 시 각각 올바른 규격으로 생성되는지
- [ ] ZIP 다운로드 시 모든 이미지가 포함되는지
- [ ] AI 배경 생성 실패 시 에러 처리가 정상 동작하는지
- [ ] 지원하지 않는 파일 형식 업로드 시 에러 메시지가 표시되는지

---

## 9. State Management

### 9.1 상태 관리 전략

React `useState` + Context API로 관리합니다. 별도 상태관리 라이브러리 없이 시작합니다.

```
EditorContext (전역 상태)
├── selectedPlatforms        ← PlatformSelector
├── selectedImageSpecs       ← ImageTypeSelector
├── heroTitle / heroTitleStyle ← TextInputForm
├── bgProductImage            ← BackgroundConfigurator (메인 상품)
├── bgSubImages[0..2]        ← BackgroundConfigurator (서브 이미지 1~3)
├── heroContentLayout        ← BackgroundConfigurator (문구 위치 프리셋)
├── products[]               ← ProductInputForm
├── productColumns           ← ColumnSelector
├── backgroundType/Image     ← BackgroundConfigurator
├── fonts / selectedFont     ← FontSelector
└── 파생 상태
    ├── currentPreviewSpec   ← 미리보기 중인 규격
    ├── allSelectedSpecs     ← 선택된 모든 규격 플랫 리스트
    └── isReadyToExport      ← 최소 필수 입력 완료 여부
```

### 9.2 Context 구조

```typescript
interface EditorContextType {
  state: EditorState;
  actions: {
    // 규격 선택 (1개씩)
    selectPlatform: (platformId: string | null) => void;
    selectImageSpec: (specId: string | null) => void;

    // 레이아웃
    setLayoutType: (type: LayoutType) => void;

    // 콘텐츠 입력
    setHeroTitle: (title: string) => void;
    setHeroTitleStyle: (style: Partial<TextStyle>) => void;
    // 상품 관리
    addProduct: () => void;
    updateProduct: (id: string, data: Partial<ProductItem>) => void;
    removeProduct: (id: string) => void;
    setProductColumns: (cols: 1 | 2 | 3) => void;

    // 배경
    setBackgroundType: (type: 'ai' | 'upload' | 'color') => void;
    setBackgroundImage: (url: string) => void;
    setBackgroundColor: (color: string) => void;
    setAiPrompt: (prompt: string) => void;
    setBgProductImage: (file: File | null) => void;
    setBgSubImage: (index: number, file: File | null) => void;
    setReferenceImage: (file: File | null) => void;
    setHeroContentLayout: (layout: HeroContentLayout) => void;

    // 폰트
    addCustomFont: (file: File) => void;
    selectFont: (family: string) => void;

    // (미리보기는 선택된 단일 규격으로 자동 적용)
  };
}
```

---

## 10. Coding Convention

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `PlatformSelector`, `ProductCard` |
| Hooks | camelCase, `use` prefix | `useEditor`, `useFontLoader` |
| Utils | camelCase | `formatPrice`, `generateFileName` |
| Types/Interfaces | PascalCase | `EditorState`, `Platform` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_FONTS`, `MAX_UPLOAD_SIZE` |
| Files (component) | PascalCase.tsx | `PlatformSelector.tsx` |
| Files (utility) | camelCase.ts | `formatPrice.ts` |
| Folders | kebab-case | `components/platform/` |

### 10.2 Environment Variables

| Name | Purpose | Scope |
|------|---------|-------|
| `GEMINI_API_KEY` | Gemini API 인증 키 (환경변수 폴백용, 선택) | Server only |

> 주: API 키는 주로 사용자가 /settings에서 localStorage에 저장하며, 환경변수는 폴백으로만 사용.

---

## 11. Implementation Guide

### 11.1 File Structure

```
📦 E-commerce Image Automation
├── app/
│   ├── page.tsx                          # 메인 편집기 페이지 (EditorProvider 포함)
│   ├── settings/
│   │   └── page.tsx                      # 설정 페이지 (API 키 + 쇼핑몰 규격)
│   ├── layout.tsx                        # 루트 레이아웃 (Navigation + Toast)
│   ├── globals.css                       # 글로벌 스타일 + Tailwind + keyframes
│   └── api/
│       ├── generate-background/
│       │   └── route.ts                  # Gemini AI 배경 생성 (Gemini/Imagen 분기)
│       └── list-models/
│           └── route.ts                  # Gemini 모델 목록 조회 API
│
├── components/
│   ├── settings/
│   │   ├── ApiKeyManager.tsx             # API 키 입력 + 모델 조회/선택
│   │   ├── PlatformManager.tsx           # 쇼핑몰 CRUD + 이미지 규격 CRUD (통합)
│   │   ├── PlatformFormModal.tsx         # 쇼핑몰 추가/수정 모달
│   │   └── ImageSpecFormModal.tsx        # 이미지 종류 추가/수정 모달
│   │
│   ├── platform/
│   │   └── PlatformSelector.tsx          # 쇼핑몰/이미지 드롭다운 + 레이아웃 유형 선택
│   │
│   ├── editor/
│   │   ├── EditorMain.tsx                # 편집기 메인 (좌설정 + 우미리보기)
│   │   ├── HeroSection.tsx               # 상단 히어로 (문구 위치 배치, flex)
│   │   ├── ProductGrid.tsx               # 하단 상품 그리드 (flex:1, alignContent:end)
│   │   ├── ProductCard.tsx               # 개별 상품 카드 (이미지 maxHeight:120px)
│   │   └── PreviewPanel.tsx              # 미리보기 (scale + renderRef 포함)
│   │
│   ├── inputs/
│   │   ├── ImageUploader.tsx             # 드래그앤드롭/클릭 이미지 업로드
│   │   ├── TextInputForm.tsx             # 문구 + 스타일 설정
│   │   ├── ProductInputForm.tsx          # 상품 정보 입력 + 열 수 선택 (통합)
│   │   ├── FontSelector.tsx              # 폰트 선택 + 업로드 (FontFace API)
│   │   └── BackgroundConfigurator.tsx    # 배경 (단색/업로드/AI) + 문구 위치 + 메인/서브 이미지 + 모델 선택
│   │
│   ├── export/
│   │   └── ExportButton.tsx              # 이미지 생성(html2canvas) + 다운로드
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Navigation.tsx
│       └── Toast.tsx
│
├── contexts/
│   └── EditorContext.tsx                  # 편집기 전역 상태 (useReducer)
│
├── hooks/
│   └── usePlatforms.ts                   # localStorage 쇼핑몰 데이터 CRUD
│
├── lib/
│   ├── storage/
│   │   ├── platformStorage.ts            # 쇼핑몰/규격 localStorage CRUD
│   │   └── apiKeyStorage.ts              # API 키/모델 설정 localStorage
│   │
│   ├── export/
│   │   └── htmlToImage.ts                # html2canvas 래퍼 (PNG/JPG 지원)
│   │
│   └── utils/
│       └── formatPrice.ts                # 가격 포맷팅 (원화)
│
├── types/
│   └── index.ts                          # 모든 타입 + 기본 스타일 상수
│
├── .env.example                          # GEMINI_API_KEY 안내
├── package.json
├── tsconfig.json
└── next.config.ts
```

### 11.2 Implementation Order (구현 완료 상태 반영)

```
Phase 1: 프로젝트 기반 설정                              ✅ Done
  1. [x] Next.js 16 + TypeScript + Tailwind 4 초기화
  2. [x] 타입 정의 + LayoutType + 기본 스타일 상수
  3. [x] 공통 UI (Button, Input, Modal, Toast, Navigation)
  4. [x] 루트 레이아웃 + 네비게이션

Phase 2: 설정 시스템 (/settings)                         ✅ Done
  5. [x] platformStorage.ts + apiKeyStorage.ts
  6. [x] usePlatforms 훅
  7. [x] PlatformManager (쇼핑몰 + 이미지 규격 CRUD 통합)
  8. [x] PlatformFormModal + ImageSpecFormModal
  9. [x] ApiKeyManager (API 키 + 모델 조회/선택)
  10. [x] /settings 페이지 통합

Phase 3: 편집기 쇼핑몰 선택                              ✅ Done
  11. [x] PlatformSelector (드롭다운 + 레이아웃 유형 선택)
  12. [x] 등록된 쇼핑몰 없을 때 → /settings 이동 안내 UI

Phase 4: 편집기 입력 UI                                  ✅ Done
  13. [x] EditorContext (useReducer 기반)
  14. [x] ImageUploader (드래그앤드롭 + 클릭)
  15. [x] TextInputForm + ProductInputForm (열 수 통합)
  16. [x] FontSelector (FontFace API 동적 로딩)
  17. [x] BackgroundConfigurator (단색/업로드/AI + 모델 선택)

Phase 5: 미리보기 렌더링                                 ✅ Done
  18. [x] HeroSection (flex 기반, 콘텐츠 크기 자동)
  19. [x] ProductCard (이미지 maxHeight:120px)
  20. [x] ProductGrid (flex:1, alignContent:end)
  21. [x] PreviewPanel (scale 기반 축소, renderRef 포함)
  22. [x] EditorMain (좌설정 + 우미리보기)

Phase 6: AI 배경 생성                                    ✅ Done
  23. [x] Gemini API Route (Gemini/Imagen 분기)
  24. [x] 모델 목록 조회 API (/api/list-models)
  25. [x] BackgroundConfigurator AI 모드 연동 + 에러 핸들링

Phase 7: 이미지 출력                                     ✅ Done
  26. [x] htmlToImage (html2canvas, PNG/JPG 지원)
  27. [x] ExportButton (생성 + 다운로드)

Phase 8: 마무리                                          ✅ Done
  28. [x] Toast 알림 + 인라인 에러 메시지
  29. [x] .env.example
  30. [x] 빌드 검증 + 푸시
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-18 | Initial draft | jeongjihye |
| 0.2 | 2026-03-19 | 구현 완료 반영: 파일 구조/컴포넌트/API/구현순서 실제와 동기화. API 키 설정(ApiKeyManager), 모델 조회(/api/list-models), 레이아웃 유형(LayoutType), 미리보기 렌더링 개선(ProductCard maxHeight, ProductGrid flex) 반영 | jeongjihye |
| 0.3 | 2026-03-22 | 구조 변경: heroImage 제거 → 메인 상품을 AI 배경에 포함. 문구 위치 프리셋(text-top/center/bottom/left). 서브 이미지(최대 3개) 추가. API에 textPositionGuide/subImage1~3 전달. EditorState/Context/UI/API 전체 반영 | jeongjihye |
| 0.4 | 2026-03-23 | 서브 문구 3개(heroSubText1~3) 추가. BackgroundCropSelector 컴포넌트 신규(드래그+줌). bgCropX/Y/Zoom state 추가. 규격별 동적 이미지 크기 요청. API 프롬프트에 종횡비 강화 | jeongjihye |
| 0.5 | 2026-03-23 | 문구 통합 배경(heroTextBg: TextBg) 추가 — 단색/그라데이션/블러 3종. 개별 문구 배경 제거. AI 프롬프트 개선: 배경 전체 채움 규칙 + 상품 위치만 조절 | jeongjihye |
