# E-commerce Event Image Generator Planning Document

> **Summary**: 이커머스 쇼핑몰 행사 이미지를 HTML/CSS + AI 배경으로 자동 생성하고 쇼핑몰별 규격으로 변환하는 웹 앱
>
> **Project**: E-commerce Image Automation
> **Version**: 0.1.0
> **Author**: jeongjihye
> **Date**: 2026-03-18
> **Status**: Draft
> **Method**: Plan Plus (Brainstorming-Enhanced PDCA)

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 쇼핑몰별로 필요한 이미지 종류(배너/썸네일/기획전 등)와 규격이 모두 다르며, 디자이너 없이는 전문적인 행사 이미지를 제작하기 어렵다 |
| **Solution** | HTML/CSS 기반 이미지 편집기 + Gemini AI 배경 생성을 결합하여, 사용자가 원하는 쇼핑몰과 이미지 종류를 선택하면 해당 규격에 맞는 행사 이미지를 자동 생성하는 웹 앱 |
| **Function/UX Effect** | 쇼핑몰/이미지 종류 선택 → 규격 자동 적용 → 상품 정보 입력 → 즉시 이미지 생성. 비디자이너도 5분 내 전문적인 행사 이미지 제작 가능 |
| **Core Value** | 행사 이미지 제작 시간을 수시간에서 수분으로 단축하고, 디자이너 의존도를 제거하며, 모든 쇼핑몰에 일관된 브랜드 품질을 유지 |

---

## 1. User Intent Discovery

### 1.1 Core Problem

이커머스 쇼핑몰 행사 운영 시 다음 4가지 문제가 동시에 존재:

1. **쇼핑몰별 규격 파악 어려움**: 각 쇼핑몰(쿠팡/11번가/지마켓/스마트스토어 등)마다 필요한 이미지 종류(메인배너, 썸네일, 기획전 이미지 등)와 규격(px)이 다르며, 이를 매번 확인하고 맞추는 것이 번거로움
2. **디자이너 의존도**: 비디자이너(MD/셀러)가 전문적인 행사 이미지를 자체 제작하기 어려움
3. **수작업 반복**: 같은 행사라도 쇼핑몰/이미지 종류별로 각각 제작해야 하는 반복 작업
4. **운영 속도**: 행사 기획부터 이미지 제작/배포까지 소요 시간이 과도함

**가장 중요한 요소**: 행사 이미지 안에 들어가는 **행사 상품 구성 설명 문구**와 **가격(할인가)** 정보

### 1.2 Target Users

| User Type | Usage Context | Key Need |
|-----------|---------------|----------|
| 쇼핑몰 MD/셀러 | 행사 기획 시 이미지 제작 | 디자인 도구 경험 없이도 전문적 이미지 제작 |
| 마케팅/디자인 팀 | 반복적 행사 이미지 대량 제작 | 수작업 리사이즈 제거, 일관된 브랜딩 |
| 소호 사업자/1인 셀러 | 디자이너 없이 쇼핑몰 운영 | 빠르고 저렴한 전문 이미지 제작 |

### 1.3 Success Criteria

- [ ] 행사 이미지 1세트(4개 쇼핑몰) 제작 시간: 수시간 → 10분 이내
- [ ] 각 쇼핑몰별 이미지 규격(px) 100% 정확히 매칭
- [ ] 디자인 경험 없는 사용자도 5분 내 첫 이미지 제작 가능
- [ ] 전문 디자이너 제작물과 비견되는 완성도

### 1.4 Constraints

| Constraint | Details | Impact |
|------------|---------|--------|
| AI 한글 렌더링 한계 | AI 이미지 생성 시 한글 텍스트가 부정확하게 렌더링됨 | High — HTML/CSS 텍스트 오버레이로 해결 |
| 쇼핑몰 규격 변동 | 쇼핑몰별 이미지 규격이 변경될 수 있음 | Medium — 규격 데이터를 설정 파일로 분리하여 대응 |
| 커스텀 폰트 라이선스 | 사용자가 업로드하는 폰트의 라이선스 이슈 | Low — 사용자 책임 안내 |

---

## 2. Alternatives Explored

### 2.1 Approach A: Canvas 기반 웹 앱 (Fabric.js/Konva.js)

| Aspect | Details |
|--------|---------|
| **Summary** | 브라우저 Canvas에서 직접 요소를 배치/편집하고 이미지로 내보내는 방식 |
| **Pros** | 실시간 미리보기, 드래그앤드롭 편집, 오프라인 가능 |
| **Cons** | 한글 타이포그래피 정밀 제어 한계, 복잡한 레이아웃 구현 어려움 |
| **Effort** | Medium |
| **Best For** | 자유로운 드래그 편집이 중요한 경우 |

### 2.2 Approach B: HTML/CSS + AI 배경 — Selected

| Aspect | Details |
|--------|---------|
| **Summary** | HTML/CSS로 레이아웃 구성 + Gemini AI로 배경 이미지 생성 + html2canvas로 이미지 변환 |
| **Pros** | CSS 타이포그래피로 한글 완벽 제어, 커스텀 폰트 지원 용이, 반응형 레이아웃 자연스러움 |
| **Cons** | html2canvas의 CSS 지원 범위 한계, 자유로운 드래그 편집은 추가 구현 필요 |
| **Effort** | Medium |
| **Best For** | 한글 문구/가격 정보가 핵심인 행사 이미지 (현재 요구사항에 최적) |

### 2.3 Approach C: 하이브리드 (Canvas + 서버 렌더링)

| Aspect | Details |
|--------|---------|
| **Summary** | Canvas로 실시간 편집 + 서버(Puppeteer)에서 고품질 최종 렌더링 |
| **Pros** | 편집 편의성 + 최고 품질 출력 |
| **Cons** | 개발 복잡도 높음, 서버 비용, 초기 구현 시간 과다 |
| **Effort** | High |
| **Best For** | 장기적 확장 계획이 있는 프로덕트 |

### 2.4 Decision Rationale

**Selected**: Approach B (HTML/CSS + AI 배경)
**Reason**: AI가 한글을 제대로 이미지로 생성하지 못하는 핵심 제약을 HTML/CSS 텍스트 레이어로 우회하면서, 행사 이미지의 가장 중요한 요소인 상품 구성 설명과 가격 정보를 CSS 타이포그래피로 정밀 제어 가능. 커스텀 폰트 업로드도 CSS @font-face로 자연스럽게 지원.

---

## 3. YAGNI Review

### 3.1 Included (v1 Must-Have)

- [x] 쇼핑몰/이미지 종류/규격 관리 페이지 (사용자가 직접 등록/수정/삭제, localStorage 저장)
- [x] 편집기에서 등록된 쇼핑몰/이미지 종류 선택 UI
- [x] 상품 이미지 업로드 (다수)
- [x] 행사 문구/가격(할인가) 입력 및 HTML/CSS 렌더링
- [x] AI 배경 이미지 생성 (Gemini API)
- [x] 레퍼런스 이미지 업로드 지원
- [x] 커스텀 폰트 업로드 (.ttf/.otf/.woff2) + 기본 폰트 제공
- [x] 문구 배치 위치 프리셋 (상단/중앙/하단/좌측) — AI가 문구 영역을 피해 상품 배치
- [x] 서브 이미지 업로드 (최대 3개, 선택 사항) — AI 배경에 함께 포함
- [x] 2단 레이아웃 (상단 히어로 + 하단 상품 안내)
- [x] 하단 상품 열 수 선택 (1열/2열/3열)
- [x] HTML → 이미지 변환 (html2canvas)
- [x] 일괄 다운로드 (ZIP)

### 3.2 Deferred (v2+ Maybe)

| Feature | Reason for Deferral | Revisit When |
|---------|---------------------|--------------|
| 행사 템플릿 라이브러리 (시즌별 프리셋) | MVP에서 사용자 행동 데이터 수집 후 인기 패턴 파악 필요 | v1 출시 후 사용 패턴 분석 시 |
| 제작 히스토리 저장/불러오기 | DB/인증 연동 필요, MVP 범위 초과 | 사용자 계정 시스템 도입 시 |
| 쇼핑몰 API 직접 업로드 | 각 쇼핑몰 API 연동 복잡도 높음 | MVP 검증 후 핵심 쇼핑몰부터 |
| 배치 생성 (여러 행사 동시 제작) | 단일 행사 워크플로 안정화 우선 | v1 안정화 후 |

### 3.3 Removed (Won't Do)

| Feature | Reason for Removal |
|---------|-------------------|
| 실시간 협업 편집 | 행사 이미지 제작은 주로 1인 작업, 복잡도 대비 가치 낮음 |
| 동영상/GIF 배너 생성 | 정적 이미지와 완전히 다른 기술 스택 필요, 별도 프로젝트 적합 |

---

## 4. Scope

### 4.1 In Scope

- [x] Next.js 기반 웹 애플리케이션
- [x] 2단 구조 행사 이미지 편집기 (히어로 + 상품 안내)
- [x] 상품 이미지 업로드 및 배치
- [x] 행사 문구, 상품명, 구성 설명, 가격/할인가 입력
- [x] 커스텀 폰트 업로드 및 적용
- [x] Gemini API를 통한 배경 이미지 생성
- [x] 레퍼런스 이미지 기반 배경 생성
- [x] 하단 상품 열 수 선택 (1/2/3열)
- [x] 실시간 HTML/CSS 기반 미리보기
- [x] html2canvas를 통한 이미지 변환
- [x] 쇼핑몰 선택 UI (단일/복수 선택 가능)
- [x] 선택한 쇼핑몰의 이미지 종류 선택 UI (규격 자동 적용)
- [x] 각 쇼핑몰별 이미지 종류/규격 데이터 사전 내장
- [x] 개별 다운로드 및 일괄 다운로드 (ZIP)

### 4.2 Out of Scope

- 행사 템플릿 라이브러리 — (v2 Deferred)
- 제작 히스토리 저장/불러오기 — (v2 Deferred)
- 쇼핑몰 API 직접 업로드 — (v2 Deferred)
- 사용자 인증/계정 시스템 — (v2 Deferred)
- 실시간 협업 편집 — (Removed)
- 동영상/GIF 배너 생성 — (Removed)

---

## 5. Requirements

### 5.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 상품 이미지를 다수 업로드할 수 있다 | High | ✅ Done |
| FR-02 | 행사 메인 문구를 입력하고 폰트/크기/색상을 설정할 수 있다 | High | ✅ Done |
| FR-02-1 | 서브 문구 3개(메인 위 1개, 메인 아래 2개)를 입력하고 개별 스타일 설정할 수 있다 | Medium | ✅ Done |
| FR-03 | 개별 상품의 상품명, 구성 설명, 원가, 할인가를 입력할 수 있다 | High | ✅ Done |
| FR-04 | 메인 상품 이미지를 업로드하고 AI 배경에 포함시킬 수 있다 | High | ✅ Done |
| FR-04-1 | 서브 이미지를 최대 3개까지 업로드하여 AI 배경에 함께 포함시킬 수 있다 | Medium | ✅ Done |
| FR-05 | Gemini API로 메인 상품+서브 이미지가 포함된 배경 이미지를 생성할 수 있다 | High | ✅ Done |
| FR-05-1 | 문구 배치 위치를 선택하면 AI가 해당 영역을 피해 상품을 배치한다 | High | ✅ Done |
| FR-05-2 | AI 생성 배경에서 사용할 영역을 드래그로 선택(크롭)할 수 있다 | Medium | ✅ Done |
| FR-05-3 | 크롭 선택 시 확대/축소(줌 100%~300%)를 조절할 수 있다 | Medium | ✅ Done |
| FR-06 | 레퍼런스 이미지를 업로드하여 배경 생성 참고로 사용할 수 있다 | Medium | ✅ Done |
| FR-07 | 커스텀 폰트 파일(.ttf/.otf/.woff2)을 업로드하여 적용할 수 있다 | High | ✅ Done |
| FR-08 | 하단 상품 영역의 열 수를 1열/2열/3열 중 선택할 수 있다 | Medium | ✅ Done |
| FR-09 | 편집 내용을 실시간 HTML/CSS 기반으로 미리볼 수 있다 | High | ✅ Done |
| FR-10 | 쇼핑몰을 선택하면 해당 쇼핑몰에서 필요한 이미지 종류 목록이 표시된다 | High | ✅ Done |
| FR-11 | 이미지 종류를 선택하면 해당 규격(px)이 자동 적용된다 | High | ✅ Done |
| FR-12 | 여러 쇼핑몰/이미지 종류를 동시에 선택하여 일괄 생성할 수 있다 | Medium | N/A (설계 변경: 단일 규격 선택) |
| FR-13 | 생성된 이미지를 개별 다운로드할 수 있다 (PNG/JPG) | High | ✅ Done |
| FR-14 | 사용자가 쇼핑몰/이미지 종류/규격을 직접 등록·수정·삭제할 수 있다 (/settings 페이지) | High | ✅ Done |
| FR-15 | 등록한 규격 데이터가 localStorage에 저장되어 브라우저 재방문 시에도 유지된다 | High | ✅ Done |
| FR-16 | Gemini API 키를 설정 페이지에서 입력/저장할 수 있다 | High | ✅ Done |
| FR-17 | 사용 가능한 AI 모델 목록을 API에서 조회하고 선택할 수 있다 | Medium | ✅ Done |
| FR-18 | 레이아웃 유형 (히어로만/상품만/히어로+상품) 선택할 수 있다 | High | ✅ Done |

### 5.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 이미지 생성(HTML→PNG) 5초 이내 | 브라우저 DevTools |
| Performance | AI 배경 생성 30초 이내 | API 응답 시간 측정 |
| Usability | 첫 사용자 이미지 제작 완료까지 5분 이내 | 사용자 테스트 |
| Compatibility | Chrome, Safari, Edge 최신 버전 지원 | 크로스 브라우저 테스트 |
| Image Quality | 출력 이미지 해상도 쇼핑몰 규격 정확 매칭 | 픽셀 단위 검증 |

---

## 6. Success Criteria

### 6.1 Definition of Done

- [x] 모든 Functional Requirements (FR-01~FR-18) 구현 완료 (FR-12는 설계 변경으로 N/A)
- [x] 쇼핑몰 규격 사용자 등록 + 자동 적용
- [x] 실시간 미리보기 정상 동작 (히어로/상품 레이아웃 포함)
- [x] AI 배경 생성 → HTML 합성 → 이미지 변환 전체 파이프라인 동작
- [x] 코드 리뷰 완료 (Gap 분석 93%)

### 6.2 Quality Criteria

- [ ] 주요 브라우저(Chrome, Safari, Edge) 호환
- [ ] 빌드 성공
- [ ] 이미지 출력 품질 육안 검증 통과

---

## 7. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| html2canvas CSS 지원 범위 한계 | High | Medium | 지원되는 CSS 속성만 사용, 복잡한 효과는 배경 이미지로 처리 |
| Gemini API 비용 증가 | Medium | Medium | 배경 생성 횟수 제한, 캐싱 도입, 사용자 직접 배경 업로드 대안 제공 |
| 쇼핑몰 규격 변경 | Medium | Low | 규격 데이터를 JSON 설정 파일로 분리하여 쉽게 업데이트 |
| 커스텀 폰트 렌더링 이슈 | Medium | Medium | 웹폰트 변환 처리, 기본 폰트 폴백 제공 |
| html2canvas 한글 폰트 렌더링 | High | Medium | @font-face 사전 로딩, Puppeteer 서버사이드 렌더링 폴백 |

---

## 8. Architecture Considerations

### 8.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | :white_check_mark: |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems | |

> Dynamic 레벨 선택: AI API 연동이 필요하지만 복잡한 인프라 불필요. Next.js API Routes로 백엔드 커버.

### 8.2 Key Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 프레임워크 | Next.js / Remix / Vite+React | Next.js (App Router) | API Routes로 Gemini 연동, 이미지 최적화 내장 |
| 이미지 렌더링 | Canvas(Fabric.js) / HTML/CSS / Server(Sharp) | HTML/CSS + html2canvas | AI 한글 한계 보완, CSS 타이포그래피 정밀 제어 |
| AI 배경 생성 | Gemini / DALL-E / Stable Diffusion | Gemini API | 사용자 요청, 한국어 프롬프트 지원 |
| 스타일링 | Tailwind CSS / styled-components / CSS Modules | Tailwind CSS | 빠른 개발, HTML/CSS 이미지에서도 활용 가능 |
| 이미지 변환 | html2canvas / Puppeteer / dom-to-image | html2canvas (1차) | 클라이언트 사이드, 서버 부하 없음. 한계 시 Puppeteer 폴백 |

### 8.3 Component Overview

```
📦 E-commerce Image Automation
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 메인 편집기 페이지
│   ├── settings/
│   │   └── page.tsx              # 쇼핑몰 규격 관리 페이지
│   ├── api/
│   │   ├── generate-background/  # Gemini AI 배경 생성
│   │   └── convert-image/        # (폴백) 서버사이드 이미지 변환
│   └── layout.tsx
│
├── components/
│   ├── platform/                 # 쇼핑몰 선택 컴포넌트
│   │   ├── PlatformSelector.tsx  # 쇼핑몰 선택 (쿠팡/11번가/지마켓/스마트스토어)
│   │   └── ImageTypeSelector.tsx # 선택한 쇼핑몰의 이미지 종류 선택
│   │
│   ├── editor/                   # 편집기 컴포넌트
│   │   ├── EditorMain.tsx        # 편집기 메인 레이아웃
│   │   ├── HeroSection.tsx       # 상단 히어로 영역 (문구 위치 배치)
│   │   ├── ProductGrid.tsx       # 하단 상품 그리드 (1/2/3열)
│   │   ├── ProductCard.tsx       # 개별 상품 카드 (이미지+상품명+구성+가격)
│   │   └── PreviewPanel.tsx      # 실시간 미리보기
│   │
│   ├── inputs/                   # 입력 컴포넌트
│   │   ├── ImageUploader.tsx     # 이미지 업로드 (상품/연출/레퍼런스)
│   │   ├── TextInputForm.tsx     # 문구/가격 입력 폼
│   │   ├── FontSelector.tsx      # 폰트 선택 + 업로드
│   │   └── ColumnSelector.tsx    # 열 수 선택 (1/2/3)
│   │
│   └── export/                   # 출력 컴포넌트
│       ├── ExportButton.tsx      # 생성/다운로드 버튼
│       └── PlatformPreview.tsx   # 쇼핑몰별 미리보기
│
├── lib/
│   ├── storage/
│   │   └── platformStorage.ts    # localStorage CRUD (쇼핑몰/규격 관리)
│   ├── gemini/                   # Gemini API 연동
│   │   └── generateBackground.ts
│   ├── image/                    # 이미지 변환 유틸
│   │   ├── htmlToImage.ts        # html2canvas 래퍼
│   │   └── resizer.ts            # 규격별 리사이즈
│   └── fonts/                    # 폰트 관리
│       └── fontManager.ts        # 커스텀 폰트 로딩/관리
│
└── types/
    └── index.ts                  # 타입 정의
```

### 8.4 Data Flow

```
[Step 1: 쇼핑몰 & 이미지 종류 선택]
  │
  ├── 쇼핑몰 선택 (단일 or 복수)
  │   ├── 쿠팡 / 11번가 / 지마켓 / 스마트스토어
  │   └── (전체 선택 가능)
  │
  └── 이미지 종류 선택 (선택한 쇼핑몰별 목록 표시)
      ├── 예: 쿠팡 → 메인배너, 상품썸네일, 기획전 이미지...
      └── 각 이미지 종류 선택 시 규격(px) 자동 적용
        │
        ▼
[Step 2: 콘텐츠 입력]
  │
  ├── 1) 행사 메인 문구 입력
  ├── 2) 메인 상품 이미지 업로드 (AI 배경에 포함)
  ├── 2-1) 서브 이미지 업로드 (최대 3개, 선택 — AI 배경에 함께 포함)
  ├── 3) 개별 상품 정보 입력 (N개)
  │     ├── 상품 이미지
  │     ├── 상품명
  │     ├── 구성 설명
  │     └── 원가 / 할인가
  ├── 4) 폰트 선택 (기본 or 업로드)
  ├── 5) 하단 열 수 선택 (1열/2열/3열)
  └── 6) (선택) 레퍼런스 이미지 업로드
        │
        ▼
[Step 3: AI 배경 생성] ← Gemini API (메인 상품+서브 이미지 포함, 문구 위치 회피)
        │
        ▼
[Step 4: HTML/CSS 합성 & 실시간 미리보기]
  ├── Layer 1: AI 배경 이미지 (메인 상품+서브 이미지가 포함된 배경)
  ├── Layer 2: 문구/가격 HTML 텍스트 (CSS 타이포그래피, 선택한 위치에 배치)
  └── Layer 3: 개별 상품 카드 그리드
        │
        ▼
[Step 5: 이미지 생성] → html2canvas로 HTML→PNG 변환
  │
  ├── 선택한 쇼핑몰/이미지 종류별로 규격 자동 적용하여 생성
  │   예) 11번가만 선택한 경우 → 11번가 규격 이미지만 생성
  │   예) 전체 선택한 경우 → 4개 쇼핑몰 모든 이미지 생성
  │
        ▼
[Step 6: 다운로드]
  ├── 개별 이미지 다운로드
  └── 전체 ZIP 일괄 다운로드
```

---

## 9. Convention Prerequisites

### 9.1 Applicable Conventions

- [ ] Next.js App Router 규칙 (app/ 디렉토리 구조)
- [ ] TypeScript strict mode
- [ ] Tailwind CSS 유틸리티 클래스 우선
- [ ] 컴포넌트: PascalCase, 파일명 = 컴포넌트명
- [ ] 유틸/라이브러리: camelCase
- [ ] 쇼핑몰 규격 데이터: JSON/TS 설정 파일로 분리

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`/pdca design ecommerce-event-image-generator`)
2. [ ] 쇼핑몰별 이미지 종류 및 정확한 규격 조사 → 앱에 사전 내장
3. [ ] Gemini API 키 설정 및 배경 생성 프롬프트 설계
4. [ ] 구현 시작 (`/pdca do ecommerce-event-image-generator`)

---

## Appendix: Brainstorming Log

> Plan Plus Phases 1-4에서의 주요 결정 사항.

| Phase | Question | Answer | Decision |
|-------|----------|--------|----------|
| Intent Q1 | 핵심 문제 | 수작업 반복 + 디자이너 의존도 + 품질 통일 + 속도 향상 (전체 선택) | 4가지 문제를 종합적으로 해결하는 솔루션 |
| Intent Q2 | 대상 사용자 | 여러 역할 모두 (MD, 디자이너, 소호) | 비디자이너도 쉽게 사용 가능한 UX 설계 |
| Intent Q3 | 성공 기준 | 제작 시간 단축 + 규격 정확도 + 디자인 품질 + 사용 편의성 | 4가지 기준 모두 달성 목표 |
| Alternatives | 구현 방식 선택 | AI + 템플릿 혼합 (HTML/CSS + Gemini) | AI 한글 한계를 HTML/CSS로 보완하는 전략 |
| YAGNI | MVP 기능 선별 | 규격 변환 + 상품 업로드/문구/가격 + AI 배경 | 템플릿 라이브러리는 v2로 연기 |
| Design V1 | 아키텍처 | HTML/CSS 기반 이미지 제작 | Canvas 대신 HTML/CSS 선택 (한글 정밀 제어) |
| Design V2 | 폰트 관리 | 커스텀 폰트 업로드 지원 추가 | @font-face로 구현 |
| Design V3 | 레이아웃 구조 | 상단 히어로 + 하단 상품 안내 2단 구조 | 이커머스 행사 이미지 표준 패턴 |
| Design V4 | 상품 열 수 | 사용자가 1/2/3열 선택 가능 | 상품 수에 따른 유연한 레이아웃 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-18 | Initial draft (Plan Plus) | jeongjihye |
| 0.2 | 2026-03-19 | 구현 완료 반영: FR 상태 업데이트, API 키 설정(FR-16), 모델 선택(FR-17), 레이아웃 유형(FR-18) 추가, 설계 변경사항 반영 | jeongjihye |
| 0.3 | 2026-03-22 | 구조 변경: 히어로 이미지 제거 → 메인 상품을 AI 배경에 포함. 문구 위치 프리셋(상단/중앙/하단/좌측)으로 변경. 서브 이미지(최대 3개) 추가. AI가 문구 위치를 피해 상품 배치 | jeongjihye |
| 0.4 | 2026-03-23 | 서브 문구 3개 추가(FR-02-1). 배경 크롭 선택기+줌(FR-05-2, FR-05-3). 규격에 맞는 동적 이미지 크기 요청 | jeongjihye |
