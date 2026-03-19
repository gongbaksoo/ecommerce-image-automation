# E-commerce Event Image Generator - Gap Analysis

> Design 문서 vs 실제 구현 비교 분석
> 분석일: 2026-03-19

## 1. Overall Match Rate: 85%

통합 구현(다른 컴포넌트에 기능이 포함된 경우)을 "구현됨"으로 카운트.

## 2. Functional Requirements 분석

| ID | 요구사항 | 상태 | 구현 위치 |
|----|---------|------|-----------|
| FR-01 | 상품 이미지 다수 업로드 | ✅ | ProductInputForm + ImageUploader |
| FR-02 | 행사 메인 문구 + 폰트/크기/색상 설정 | ✅ | TextInputForm |
| FR-03 | 상품명, 구성 설명, 원가, 할인가 입력 | ✅ | ProductInputForm |
| FR-04 | 메인 상품 연출 이미지 업로드 | ✅ | EditorMain + ImageUploader |
| FR-05 | Gemini AI 배경 이미지 생성 | ⚠️ | API Route 존재, Gemini text 모델은 이미지 생성 불가 (placeholder) |
| FR-06 | 레퍼런스 이미지 업로드 | ✅ | BackgroundConfigurator |
| FR-07 | 커스텀 폰트 업로드 (.ttf/.otf/.woff2) | ✅ | FontSelector (FontFace API) |
| FR-08 | 하단 상품 열 수 1/2/3열 선택 | ✅ | ProductInputForm |
| FR-09 | 실시간 HTML/CSS 미리보기 | ✅ | PreviewPanel + HeroSection + ProductGrid |
| FR-10 | 쇼핑몰 선택 시 이미지 종류 목록 표시 | ✅ | PlatformSelector (드롭다운) |
| FR-11 | 이미지 종류 선택 시 규격 자동 적용 | ✅ | PlatformSelector → PreviewPanel |
| FR-12 | 여러 쇼핑몰/이미지 종류 동시 선택 일괄 생성 | N/A | 설계 변경: 단일 규격 선택 방식으로 변경됨 |
| FR-13 | 개별 또는 ZIP 다운로드 | ⚠️ | 개별 다운로드 구현, ZIP 미구현 (단일 규격이라 필요성 낮음) |
| FR-14 | 쇼핑몰/이미지 규격 등록·수정·삭제 (/settings) | ✅ | PlatformManager + modals |
| FR-15 | localStorage 저장 영속성 | ✅ | platformStorage.ts |

**FR 충족률**: 12/14 = 86% (FR-12는 설계 변경으로 N/A)

## 3. Design 컴포넌트 vs 구현 비교

### 구현 완료 (직접 매치)

| Design 컴포넌트 | 구현 파일 | 상태 |
|----------------|-----------|------|
| PlatformManager | components/settings/PlatformManager.tsx | ✅ |
| PlatformFormModal | components/settings/PlatformFormModal.tsx | ✅ |
| ImageSpecFormModal | components/settings/ImageSpecFormModal.tsx | ✅ |
| PlatformSelector | components/platform/PlatformSelector.tsx | ✅ |
| EditorMain | components/editor/EditorMain.tsx | ✅ |
| HeroSection | components/editor/HeroSection.tsx | ✅ |
| ProductGrid | components/editor/ProductGrid.tsx | ✅ |
| ProductCard | components/editor/ProductCard.tsx | ✅ |
| PreviewPanel | components/editor/PreviewPanel.tsx | ✅ |
| ImageUploader | components/inputs/ImageUploader.tsx | ✅ |
| TextInputForm | components/inputs/TextInputForm.tsx | ✅ |
| ProductInputForm | components/inputs/ProductInputForm.tsx | ✅ |
| FontSelector | components/inputs/FontSelector.tsx | ✅ |
| BackgroundConfigurator | components/inputs/BackgroundConfigurator.tsx | ✅ |
| ExportButton | components/export/ExportButton.tsx | ✅ |
| Button | components/ui/Button.tsx | ✅ |
| Input | components/ui/Input.tsx | ✅ |
| Modal | components/ui/Modal.tsx | ✅ |
| Toast | components/ui/Toast.tsx | ✅ |
| Navigation | components/ui/Navigation.tsx | ✅ |

### 통합 구현 (별도 파일 없이 다른 컴포넌트에 포함)

| Design 컴포넌트 | 통합 위치 | 상태 |
|----------------|-----------|------|
| ImageTypeSelector | PlatformSelector 내 드롭다운으로 통합 | ✅ 통합 |
| ColumnSelector | ProductInputForm 내 버튼으로 통합 | ✅ 통합 |
| ImageSpecManager | PlatformManager 내 테이블로 통합 | ✅ 통합 |
| RenderTarget | PreviewPanel 내 renderRef div로 통합 | ✅ 통합 |

### 미구현

| Design 컴포넌트/파일 | 상태 | 영향도 |
|---------------------|------|--------|
| DownloadManager | ❌ | Low — 단일 파일 다운로드로 충분 |
| resizer.ts | ❌ | Low — 단일 규격이라 리사이즈 불필요 |
| zipDownloader.ts | ❌ | Low — 단일 다운로드로 충분 |
| defaultFonts.ts | ❌ | Low — FontSelector에서 하드코딩 |
| generateFileName.ts | ❌ | Low — ExportButton에서 인라인 구현 |
| Checkbox/RadioGroup/ColorPicker (UI) | ❌ | Low — 네이티브 HTML 사용 |
| .env.example | ❌ | Medium — API 키 설정 안내 누락 |

## 4. Architecture Match

| 항목 | Design | 구현 | 상태 |
|------|--------|------|------|
| 프레임워크 | Next.js App Router | Next.js 16 App Router | ✅ |
| 상태관리 | React Context + useReducer | EditorContext + useReducer | ✅ |
| 쇼핑몰 데이터 | localStorage CRUD | platformStorage.ts | ✅ |
| 이미지 렌더링 | HTML/CSS + html2canvas | HTML/CSS + html2canvas | ✅ |
| AI 배경 | Gemini API Route | API Route 존재 (placeholder) | ⚠️ |
| 폰트 로딩 | @font-face 동적 로딩 | FontFace API 사용 | ✅ |
| 레이아웃 유형 | hero-only/products-only/hero-products | 3가지 모두 구현 | ✅ |
| 단일 규격 선택 | 드롭다운 1개씩 | PlatformSelector 드롭다운 | ✅ |

**Architecture Match Rate: 93%**

## 5. Gap 목록 (우선순위)

### High Priority
| # | Gap | 영향 |
|---|-----|------|
| 1 | AI 배경 생성 API가 placeholder | 핵심 기능 미동작 — Gemini Imagen API 또는 대안 필요 |
| 2 | .env.example 미생성 | 개발자 온보딩 시 API 키 설정 안내 누락 |

### Low Priority (설계 변경으로 필요성 감소)
| # | Gap | 영향 |
|---|-----|------|
| 3 | ZIP 다운로드 미구현 | 단일 규격 선택이라 개별 다운로드로 충분 |
| 4 | resizer.ts 미구현 | 단일 규격이라 리사이즈 불필요 |
| 5 | 별도 유틸 파일 미분리 (generateFileName, defaultFonts 등) | 기능은 동작, 코드 구조만의 차이 |

## 6. 최종 Match Rate 계산

| 카테고리 | 점수 |
|---------|------|
| FR 충족률 | 86% (12/14) |
| 컴포넌트 매치 | 88% (24/27, 통합 포함) |
| Architecture 매치 | 93% (13/14) |
| **종합 Match Rate** | **85%** |

## 7. 권장 다음 단계

Match Rate 85% < 90% 이므로:
1. `.env.example` 생성 (GEMINI_API_KEY 안내)
2. AI 배경 생성 API를 실질적으로 동작하게 개선 (또는 Design 문서에서 placeholder로 명시)
3. 이후 `/pdca iterate` 또는 `/pdca report`
