# CLAUDE.md

**모든 진행 설명은 한글로 출력해줘.**
**모든 디자인 작업은 /docs/linear_theme.json를 바탕으로 일반화, 중앙화하여 만들어줘. 트랜디 하고 세련되게 디자인 작업 진행해줘**
**기본적으로 라이트모드와 다크모드로 전환할 수 있는 기능을 header 영역에 제공해줘**
**global CSS를 통해서 전체 컬러 값 등 모든 요소를 수정하고 관리할 수 있도록 중앙화와 일반화를 신경써서 만들어줘.**
**너는 MCP를 사용할 수 있어. 적용되어 있는 MCP를 우선적으로 사용하면서 작업을 진행해줘.**
**요청한 요건이 완료되면 마지막에는 반드시 github MCP를 활용해서 커밋 하고 푸시해줘**
git은 Donggull/ea_plan_04의 master 브랜치에 커밋과 푸시를 진행하면 돼.
**모든 데이터는 실제 데이터인 supabase와 연동되도록 개발해줘.**
**메인페이지를 제외한 전체페이지는 보호된 페이지로 설정하고 비로그인 상태에서 접근시 로그인 페이지로 이동되도록 적용**
**로그인이 완료되면 모든 페이지에는 로그인 정보가 연동 되어야 하고 환경에 따라 접근 가능한 부분을 설정할 예정이야. 모든 페이지에 로그인 정보가 연동되도록 기본 설계가 되어야해.**
**브라우저가 종료되는 경우 모든 세션이 종료되는 것을 기본으로 적용하되 브라우저 창의 이동중에는 세션이 끊어지지 않도록 적용하는 것을 원칙으로 작업**
**새로운 페이지를 생성하더라도 위의 로그인 관련 정책음 모두 동일하게 유지해야 돼**
**타입 오류가 발생되지 않도록 기존에 문제없이 개발 완료된 내용을 참조해서 적용해줘.**
**프로세스 진행 단계 중 확인 또는 취소가 필요한 경우 alert 기능을 사용하지 말고 반드시 모달 형태로 표현해줘. 모달에서 확인 및 취소 등의 기능을 적용해 주고 이중으로 alert이 같이 발생하지 않도록 주의해줘.**
**/docs 폴더에 있는 파일은 커밋과 푸시에서 제외해줘.**

**기존에 적용되어 있는 인증 관련 부분은 동의없이 임의로 절대 수정 변경하지마. 전체 페이지에 적용되어 있는 인증 페이지와 충돌이 발생할 수 있으니 변경이 필요한 경우 반드시 동의를 구하고 진행해야돼.**


# ELUO 프로젝트 - Claude Code 개발 가이드

## 🎯 프로젝트 개요
ELUO는 **Vite + React 19 + Supabase** 기반의 AI 통합 프로젝트 관리 플랫폼입니다. 제안서 작성부터 구축, 운영까지 전 과정을 AI가 지원하는 통합 솔루션을 개발합니다.

## 📚 필수 문서 읽기
Claude Code로 개발하기 전에 다음 문서들을 반드시 읽어주세요:

### 1️⃣ 핵심 문서 (필수)
- `docs/prd_main.md` - 프로젝트 전체 개요 및 비전
- `docs/prd_technical.md` - Vite + React 19 기술 사양
- `docs/vite_react19_prompts.md` - 단계별 개발 프롬프트

### 2️⃣ 상세 문서 (참조)
- `docs/prd_features.md` - 기능 명세서
- `docs/prd_ui_ux.md` - UI/UX 가이드
- `docs/prd_api_integration.md` - AI 및 API 통합
- `docs/prd_database.md` - 데이터베이스 설계
- `docs/supabase_integration.md` - Supabase 연동 가이드
- `docs/react19_features.md` - React 19 기능 활용법

## 🚀 빠른 시작 (Claude Code용)

### Phase 0: 프로젝트 초기 설정
```bash
# Claude Code에서 실행할 명령어들
npm create vite@latest eluo-platform -- --template react-ts
cd eluo-platform

# React 19 업그레이드
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19

# 필수 패키지 설치
npm install @supabase/supabase-js zustand @tanstack/react-query react-router-dom
npm install react-hook-form @hookform/resolvers zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react clsx tailwind-merge

# 개발 도구 설치
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
npm install -D vitest @vitest/ui jsdom
npm install -D prettier eslint-config-prettier
```

## 📋 단계별 개발 프롬프트

### Phase 1: 기본 프로젝트 구조 (1주차)
Claude Code에서 다음과 같이 요청하세요:

```
docs/vite_react19_prompts.md 파일의 Phase 1 프롬프트를 참조하여 다음을 구현해주세요:

1. Vite + React 19 프로젝트 기본 설정
   - vite.config.ts 최적화 설정
   - tsconfig.json React 19 설정
   - tailwind.config.js 설정

2. 기본 폴더 구조 생성
   - src/components (ui, layout, shared)
   - src/pages
   - src/hooks
   - src/stores
   - src/lib
   - src/types

3. ShadCN/UI 컴포넌트 시스템 설정
   - Button, Input, Card, Dialog 등 기본 컴포넌트
   - Tailwind CSS 통합

문서의 정확한 가이드라인에 따라 구현해주세요.
```

### Phase 2: Supabase 연동 (2주차)
```
docs/supabase_integration.md와 docs/prd_database.md를 참조하여:

1. Supabase 클라이언트 설정
   - lib/supabase/client.ts 생성
   - 환경변수 설정 (.env.local)
   - TypeScript 타입 생성

2. 인증 시스템 구현
   - 로그인/회원가입 페이지
   - useAuth 훅 구현
   - RLS 정책 적용

3. 기본 데이터베이스 스키마 생성
   - user_profiles, projects 테이블
   - RLS 정책 설정

React 19의 useFormState, useFormStatus를 활용한 현대적인 폼 구현을 포함해주세요.
```

### Phase 3: AI 통합 기반 (3주차)
```
docs/prd_api_integration.md를 참조하여 AI 서비스 통합을 구현해주세요:

1. AI 서비스 매니저 구현
   - OpenAI, Google Gemini, Anthropic Claude 통합
   - 멀티 모델 지원 아키텍처
   - 토큰 사용량 추적

2. React 19 기반 AI 채팅 인터페이스
   - useOptimistic을 활용한 즉각적인 메시지 표시
   - 실시간 타이핑 효과
   - 에러 처리 및 재시도

3. 기본 RAG 시스템 구현
   - 문서 업로드 및 벡터화
   - pgvector를 활용한 유사도 검색

React 19의 새로운 기능들을 적극 활용해주세요.
```

### Phase 4: 프로젝트 관리 모듈 (4-5주차)
```
docs/prd_features.md의 기획 모듈 섹션을 참조하여:

1. 프로젝트 CRUD 구현
   - useOptimistic으로 즉각적인 UI 업데이트
   - 실시간 협업 기능 (Supabase Realtime)
   - 프로젝트 대시보드

2. 문서 업로드 및 관리
   - Drag & Drop 파일 업로드
   - OCR 텍스트 추출
   - AI 기반 문서 분석

3. 요구사항 관리 시스템
   - CRUD 작업 with React 19 hooks
   - 상태 관리 (Zustand)
   - 실시간 업데이트

모든 컴포넌트는 React 19의 새로운 기능을 활용하여 구현해주세요.
```

### Phase 5: 제안 진행 모듈 (6-7주차)
```
docs/prd_features.md의 제안 진행 영역을 참조하여:

1. RFP 분석 시스템
   - 파일 업로드 및 OCR 처리
   - AI 기반 요구사항 추출
   - 분석 결과 시각화

2. 시장 조사 자동화
   - 웹 검색 API 통합
   - AI 기반 시장 분석
   - 경쟁사 정보 수집

3. 제안서 자동 생성
   - 템플릿 기반 생성
   - AI 기반 내용 자동 완성
   - 실시간 협업 편집

useDeferredValue를 활용한 검색 최적화도 포함해주세요.
```

### Phase 6: 이미지 생성 및 고급 기능 (8-9주차)
```
docs/prd_api_integration.md의 이미지 생성 섹션을 참조하여:

1. AI 이미지 생성 시스템
   - DALL-E, Flux 통합
   - 프롬프트 최적화
   - 이미지 라이브러리 관리

2. 고급 AI 기능
   - 커스텀 챗봇 빌더
   - RAG 기반 지식 검색
   - 다중 AI 모델 활용

3. 성능 최적화
   - React 19 Concurrent Features 활용
   - Vite 번들 최적화
   - 메모리 최적화

React 19의 useTransition과 Suspense를 적극 활용해주세요.
```

## ⚙️ 개발 환경 설정

### 필수 환경변수 (.env.local)
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI 서비스
VITE_OPENAI_API_KEY=your_openai_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_GOOGLE_API_KEY=your_google_key

# 기타
VITE_APP_ENV=development
```

### Vite 설정 (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ai: ['openai', '@google/generative-ai']
        }
      }
    }
  }
})
```

## 🎨 컴포넌트 스타일 가이드

### React 19 컴포넌트 예시
```typescript
// useOptimistic 활용 예시
function OptimisticButton({ onClick, children }) {
  const [isPending, startTransition] = useTransition()
  
  const handleClick = () => {
    startTransition(async () => {
      await onClick()
    })
  }

  return (
    <button 
      onClick={handleClick}
      disabled={isPending}
      className="btn-primary"
    >
      {isPending ? '처리 중...' : children}
    </button>
  )
}

// use() Hook 활용 예시
function DataComponent({ dataPromise }) {
  const data = use(dataPromise)
  
  return <div>{data.title}</div>
}
```

### Tailwind CSS 클래스 명명 규칙
```css
/* 컴포넌트별 접두사 사용 */
.btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded-lg; }
.card-default { @apply bg-white rounded-xl border shadow-sm; }
.input-field { @apply border border-gray-300 rounded-lg px-3 py-2; }
```

## 🧪 테스트 전략

### 단위 테스트 (Vitest)
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button correctly', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

### E2E 테스트 설정
```bash
npm install -D @playwright/test
npx playwright install
```

## 📦 패키지 관리

### 핵심 의존성
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "react-router-dom": "^6.18.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.290.0"
  }
}
```

## 🔧 개발 도구

### VS Code 권장 확장
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

### 유용한 스니펫
```json
// React 19 함수형 컴포넌트
{
  "React 19 Component": {
    "prefix": "r19c",
    "body": [
      "import { use, useOptimistic, useTransition } from 'react'",
      "",
      "interface ${1:Component}Props {",
      "  ${2:prop}: ${3:string}",
      "}",
      "",
      "export function ${1:Component}({ ${2:prop} }: ${1:Component}Props) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

## 🚨 중요 주의사항

### React 19 마이그레이션
1. **StrictMode 사용**: 개발 중 잠재적 문제 발견
2. **Concurrent Features**: useTransition, useDeferredValue 적극 활용
3. **New Hooks**: useOptimistic, use(), useFormState 활용
4. **Error Boundaries**: 컴포넌트 에러 처리 강화

### Vite 최적화
1. **HMR 활용**: 빠른 개발 피드백 루프
2. **Code Splitting**: 청크 최적화로 로딩 성능 향상
3. **Tree Shaking**: 불필요한 코드 제거
4. **Asset Optimization**: 이미지, 폰트 최적화

### Supabase 베스트 프랙티스
1. **RLS 정책**: 모든 테이블에 적절한 보안 정책 적용
2. **Real-time 구독**: 메모리 누수 방지를 위한 구독 해제
3. **Type Safety**: Supabase CLI로 타입 생성
4. **Edge Functions**: 서버사이드 로직 처리

## 🎯 개발 우선순위

### 1차 목표 (4주)
- [x] 프로젝트 기본 구조 설정
- [ ] Supabase 인증 시스템
- [ ] 기본 AI 채팅 인터페이스
- [ ] 프로젝트 CRUD 구현

### 2차 목표 (8주)
- [ ] 제안 진행 모듈 완성
- [ ] 구축 관리 모듈 완성
- [ ] 이미지 생성 시스템
- [ ] RAG 기반 검색

### 3차 목표 (13주)
- [ ] 운영 관리 모듈
- [ ] 성능 최적화
- [ ] PWA 기능
- [ ] 배포 및 모니터링

## 📞 지원 및 문의

개발 중 문제가 발생하면 다음 문서들을 참조하세요:
- 기술적 문제: `docs/prd_technical.md`
- 기능 구현: `docs/prd_features.md`
- API 통합: `docs/prd_api_integration.md`
- UI/UX: `docs/prd_ui_ux.md`

---

**이 가이드를 따라 Claude Code에서 단계적으로 개발을 진행하세요. 각 Phase별로 해당 프롬프트를 사용하여 체계적으로 구현할 수 있습니다.**
