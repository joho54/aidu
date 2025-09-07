# Aidu - AI 기반 교육 문제 분석 앱

Aidu는 React Native로 개발된 AI 기반 교육 문제 분석 및 피드백 제공 모바일 애플리케이션입니다. 학생들이 시험 문제를 촬영하면 AI가 자동으로 분석하고, 개별 문제에 대한 맞춤형 피드백을 제공합니다.

## 🚀 주요 기능

- **이미지 기반 문제 분석**: AI를 활용한 시험 문제 자동 인식 및 분석
- **문제 유형 분류**: 객관식/서술형 문제 자동 분류
- **AI 튜터 채팅**: 개별 문제에 대한 맞춤형 피드백 및 학습 가이드 제공
- **시험 결과 저장**: 분석된 문제들을 로컬 데이터베이스에 저장
- **학습 이력 관리**: 과거 시험 결과 및 피드백 히스토리 조회

## 🛠 기술 스택

### 프론트엔드
- **React Native 0.81.1** - 크로스 플랫폼 모바일 앱 개발
- **TypeScript** - 타입 안전성 보장

### 백엔드 API
- **RESTful API** - HTTP 기반 통신
- **AI/LLM 서비스** - 이미지 분석 및 채팅봇 기능

### 데이터베이스
- **SQLite** - 로컬 데이터 저장 (react-native-sqlite-storage)
- **로컬 파일 시스템** - 이미지 및 데이터 파일 관리

### 주요 라이브러리
- **Axios** - HTTP 클라이언트
- **React Native Image Picker** - 이미지 선택 및 촬영
- **React Native Config** - 환경 변수 관리
- **React Native FS** - 파일 시스템 접근

## 📡 주요 API

### 1. 이미지 분석 API
```
POST /analyze-image
```
- **기능**: 시험 문제 이미지를 AI로 분석하여 문제 정보 추출
- **요청**: 
  ```json
  {
    "prompt": "분석 프롬프트",
    "base64_image": "base64 인코딩된 이미지"
  }
  ```
- **응답**: 
  ```json
  {
    "success": true,
    "analysis": "분석 결과 텍스트"
  }
  ```

### 2. AI 튜터 채팅 API
```
POST /chatbot
```
- **기능**: 문제별 맞춤형 피드백 및 학습 가이드 제공
- **요청**:
  ```json
  {
    "messages": [
      {
        "role": "system|user|assistant",
        "content": "메시지 내용"
      }
    ]
  }
  ```
- **응답**:
  ```json
  {
    "message": "AI 응답 메시지"
  }
  ```

## 🗄 데이터베이스 스키마

### Tests 테이블
- `test_id` (INTEGER PRIMARY KEY)
- `test_name` (TEXT NOT NULL)
- `total_problems` (INTEGER DEFAULT 0)
- `correct_problems` (INTEGER DEFAULT 0)

### Problems 테이블
- `problem_id` (INTEGER PRIMARY KEY)
- `test_id` (INTEGER, FOREIGN KEY)
- `type` (TEXT) - 'essay' | 'multiple_choices'
- `number` (INTEGER)
- `content` (TEXT)
- `figure` (TEXT)
- `options` (TEXT)
- `correct_answer` (TEXT)
- `selected_answer` (TEXT)

## 📱 화면 구성

- **HomeScreen**: 이미지 촬영/선택 및 문제 분석
- **ChatScreen**: AI 튜터와의 1:1 채팅
- **HistoryScreen**: 과거 시험 결과 조회
- **ReviewPage**: 문제 상세 리뷰

## 🚀 시작하기

### 사전 요구사항
- Node.js >= 20
- React Native 개발 환경 설정
- iOS: Xcode 및 CocoaPods
- Android: Android Studio 및 SDK

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   # 또는
   yarn install
   ```

2. **iOS 의존성 설치** (iOS만 해당)
   ```bash
   bundle install
   bundle exec pod install
   ```

3. **Metro 서버 시작**
   ```bash
   npm start
   # 또는
   yarn start
   ```

4. **앱 실행**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수를 설정하세요:
```
API_BASE_URL=http://your-backend-server:8000
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── screens/            # 화면 컴포넌트
├── services/           # API 및 비즈니스 로직
├── DTO/               # 데이터 전송 객체
├── hooks/             # 커스텀 훅
├── navigations/       # 네비게이션 설정
└── types/             # TypeScript 타입 정의
```

## 🔧 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Jest** - 테스트 프레임워크
- **TypeScript** - 정적 타입 검사