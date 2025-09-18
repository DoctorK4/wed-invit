# Heejin & Dongryul Wedding Invitation

모바일에서 가볍게 열람할 수 있도록 구성한 희진 & 동률의 디지털 청첩장 프로젝트입니다. 영상, 배경 음악, 사진 갤러리, RSVP 폼, 네이버 지도 안내까지 한 화면에서 제공하여 초대장을 받은 분들이 자연스럽게 스크롤하며 필요한 정보를 확인할 수 있도록 했습니다.

## 주요 기능
- **Hero 비디오 & 배경 음악**: 팝업에서 음악 재생 여부를 선택할 수 있으며, 모달이 열린 동안에도 영상을 미리 로드해 보다 빠르게 재생이 시작됩니다.
- **프롬프트 기반 인터랙션**: 첫 진입 시 스크롤 잠금을 적용해 음악 선택 모달에 집중할 수 있게 하고, 닫힘과 동시에 자연스럽게 콘텐츠로 진행됩니다.
- **사진 갤러리**: `yet-another-react-lightbox` 및 Zoom 플러그인을 활용해 썸네일 클릭 시 확대 뷰를 제공합니다.
- **RSVP 폼**: 이름, 연락처, 교통수단 정보를 받아 Google Apps Script 등 외부 엔드포인트로 전송합니다.
- **네이버 지도 안내**: 주소 문자열을 기반으로 지오코딩 후 마커를 표시하며, 모바일 터치 제스처를 고려한 상호작용 제어를 담고 있습니다.
- **Framer Motion 애니메이션**: 주요 섹션마다 부드러운 스크롤 인-뷰 애니메이션을 적용했습니다.

## 기술 스택
- **Framework**: React 18 + TypeScript
- **Build Tooling**: Vite 7
- **UI & Animation**: Tailwind CSS 4, Framer Motion
- **Media & Map**: HTML5 `<video>`, `<audio>`, yet-another-react-lightbox, Naver Maps JS SDK
- **Data Handling**: Axios를 통한 RSVP API 호출

## 프로젝트 구조 (요약)
```
├─ public/            # 정적 자산 (비디오, 이미지, 오디오 등)
├─ src/
│  ├─ api/           # RSVP API 래퍼
│  ├─ components/    # Gallery, MapSection 등 UI 컴포넌트
│  ├─ service/       # addToCalendar 유틸리티 (캘린더 저장)
│  ├─ App.tsx        # 메인 페이지 구성
│  └─ index.css      # Tailwind 및 커스텀 색상 변수
└─ vite.config.ts
```

## 사전 준비물
- Node.js 18 이상 권장 (LTS)
- 패키지 매니저: `npm`(기본), `pnpm` 또는 `bun`도 사용 가능

## 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기 (정적 호스팅 검증용)
npm run preview
```
Vite 개발 서버는 기본적으로 `http://localhost:5173`에서 열립니다.

## 환경 변수 설정
`Vite`는 루트 디렉터리의 `.env` 파일에서 `VITE_` 프리픽스가 붙은 변수를 로드합니다. 다음 값을 프로젝트 요구사항에 맞게 설정해 주세요.

| 변수명 | 설명 |
| --- | --- |
| `VITE_APP_SCRIPT_URL` | RSVP 정보를 수집할 Google Apps Script 등의 POST 엔드포인트 URL |
| `VITE_NAVERMAP_API_CID` | 네이버 지도 JavaScript SDK용 NCP Client ID |

예시 `.env`:
```
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/xxxxxxxx/exec
VITE_NAVERMAP_API_CID=your-ncp-client-id
```

## 자산 교체 가이드
- **비디오 & 포스터**: `public/images/Our Wedding.mp4`, `public/images/Our Wedding.jpg` 파일을 동일한 경로/이름으로 교체하면 됩니다.
- **배경 음악**: `public/images/tokyo87.mp3` 파일 교체 또는 `src/App.tsx`의 `<audio src="..." />` 경로 수정.
- **갤러리 이미지**: `src/App.tsx`의 `slides` 배열과 `public/images/` 하위 파일을 원하는 이미지로 교체.
- **인사말 이미지**: `greeting_edited.jpg`, `ellieLetter.jpg`, `drLetter.jpg` 파일 교체.

## RSVP 연동
`src/api/addRSVP.ts`에서 Axios POST 요청을 전송합니다. 응답 형태에 따라 에러 처리나 성공 처리 로직을 확장할 수 있으며, 서버에 `application/x-www-form-urlencoded`를 기대할 경우 백엔드 구현을 일치시켜 주세요.

## 지도 연동
`src/components/MapSection.tsx`는 네이버 지도 SDK를 지연 로드하며, 주소 문자열을 지오코딩합니다. 주소가 변경될 경우 `App.tsx`에서 전달하는 `address` prop을 수정하면 됩니다. 모바일 터치 제스처 제어 및 로딩 실패 로그가 포함되어 있으므로 필요 시 추가 에러 핸들링을 구현할 수 있습니다.

## 배포
`npm run build` 결과물은 `dist/` 디렉터리에 생성되며 정적 호스팅(Vercel, Netlify, GitHub Pages 등)에 손쉽게 배포할 수 있습니다. 커스텀 도메인을 사용하는 경우 `CNAME` 파일을 유지하세요.

## 기타
- `src/service/addToCalendar.ts`를 활용하면 캘린더 저장 기능을 확장할 수 있습니다. 현재는 컴포넌트에서 직접 사용하지 않지만, 버튼을 배치해 호출할 수 있습니다.
- Tailwind Utility 클래스 외에 일부 고정 색상을 `src/index.css`에서 정의하고 있으므로, 브랜드 컬러 변경 시 해당 파일을 함께 수정하면 편리합니다.