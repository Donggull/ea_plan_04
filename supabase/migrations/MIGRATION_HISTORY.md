# ELUO 프로젝트 - Supabase 마이그레이션 히스토리

생성일: 2025-01-12
프로젝트: ELUO Platform (React 19 + Vite + Supabase)

## 🗂️ 마이그레이션 목록

### 001_enable_extensions
**목적**: PostgreSQL Extensions 활성화
**생성일**: 2025-01-12
**내용**:
- uuid-ossp (UUID 생성)
- pgcrypto (암호화 함수)
- pg_trgm (텍스트 검색)

### 002_create_profiles_table
**목적**: 사용자 프로필 테이블 생성
**생성일**: 2025-01-12
**내용**:
- profiles 테이블 생성
- auth.users와 1:1 관계
- RLS 정책 적용
- 인덱스 생성

### 003_create_projects_tables
**목적**: 프로젝트 관리 테이블들 생성
**생성일**: 2025-01-12
**내용**:
- projects 테이블 생성
- project_members 테이블 생성
- 프로젝트 기반 권한 시스템 구현
- RLS 정책 적용

### 004_create_documents_tables
**목적**: 문서 관리 테이블들 생성
**생성일**: 2025-01-12
**내용**:
- documents 테이블 생성
- document_content 테이블 생성
- 전문 검색 인덱스 생성
- 프로젝트 권한 기반 접근 제어

### 005_create_storage_and_functions
**목적**: Storage 및 트리거 함수 생성
**생성일**: 2025-01-12
**내용**:
- documents Storage 버킷 생성
- Storage RLS 정책 적용
- updated_at 자동 업데이트 트리거
- 새 사용자 프로필 자동 생성 함수

## 🔐 보안 정책

### RLS (Row Level Security)
모든 public 테이블에 RLS 활성화:
- `profiles`: 자신의 프로필만 조회/수정 가능
- `projects`: 프로젝트 멤버만 접근 가능
- `project_members`: 같은 프로젝트 멤버만 조회 가능
- `documents`: 프로젝트 멤버만 조회, 편집자 이상만 업로드 가능
- `document_content`: 문서 권한을 따라감

### Storage 정책
- `documents` 버킷: 비공개
- 프로젝트 멤버만 파일 조회 가능
- 인증된 사용자만 업로드 가능

## 📊 테이블 관계도

```
auth.users (Supabase Auth)
    ↓ 1:1
profiles (사용자 프로필)
    ↓ 1:N
projects (프로젝트)
    ↓ 1:N
project_members (멤버십) ← N:1 → profiles
    ↓
documents (문서) ← N:1 → projects
    ↓ 1:1
document_content (문서 내용)
```

## 🚀 다음 단계

1. **실제 사용자 등록 및 테스트**
   - 회원가입/로그인 테스트
   - 프로필 자동 생성 확인

2. **프로젝트 기능 테스트**
   - 프로젝트 생성
   - 멤버 초대
   - 권한 시스템 검증

3. **문서 관리 기능 구현**
   - 파일 업로드
   - 문서 분석
   - 검색 기능

## ⚠️ 주의사항

- **테스트 데이터**: profiles 테이블은 실제 인증된 사용자만 생성 가능
- **Storage**: documents 버킷은 비공개로 설정됨
- **RLS**: 모든 데이터 접근이 권한 기반으로 제어됨
- **백업**: 마이그레이션 전 데이터베이스 백업 권장

## 📞 문의

마이그레이션 관련 문제 발생 시:
1. Supabase Dashboard에서 SQL 로그 확인
2. RLS 정책 점검
3. 테이블 관계 및 제약조건 확인