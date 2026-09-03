# A2DL 연구실 홈페이지

**A2DL — AI Autonomous Drug Discovery Lab** (AI 자율 신약개발 연구실)
한국화학연구원(KRICT) · UST-KRICT 스쿨 연구실 홈페이지입니다.
빌드 도구 없이 동작하는 정적 사이트(HTML/CSS/JS)라서, 파일을 수정하고 push 하면 바로 반영됩니다.

## 구조

```
index.html                  # 페이지 전체 (모든 텍스트가 여기에 있습니다)
assets/css/style.css        # 디자인 · 색상 · 반응형
assets/js/main.js           # 한/영 전환, 모바일 메뉴, 스크롤 효과
assets/img/                 # 구성원 사진 등 이미지
assets/data/publications.json  # 논문 목록 (여기만 고치면 화면에 반영됩니다)
.github/workflows/pages.yml # main 브랜치 push 시 자동 배포
```

## 배포 (최초 1회 설정 — 반드시 수동으로 해야 합니다)

GitHub Pages는 저장소 관리자가 UI에서 한 번 켜 주어야 합니다.
Actions의 `GITHUB_TOKEN`으로는 자동 활성화가 되지 않습니다
(`Create Pages site failed: Resource not accessible by integration`).

1. 저장소 **Settings → Pages** 이동
2. **Source** 를 `GitHub Actions` 로 선택 (`Deploy from a branch` 아님)
3. 이후 기본 브랜치에 push하면 워크플로가 자동 배포합니다
   - 바로 배포하려면 **Actions → Deploy to GitHub Pages → Run workflow**

배포 주소: **https://a2dl.chembank.org/**

커스텀 도메인을 쓰므로 저장소 루트가 도메인 루트로 서비스됩니다.
`https://yunolee1-bit.github.io/TEST1/` 로 들어오면 위 주소로 리디렉션됩니다.

- DNS: `a2dl` CNAME -> `yunolee1-bit.github.io`
- 저장소 루트의 `CNAME` 파일에 도메인이 들어 있습니다. **지우지 마세요.**

> 참고: 이 저장소에는 `main` 브랜치가 없습니다. 빈 저장소에 처음 push한
> `claude/web-platform-prototype-testing-vkatpr` 가 기본 브랜치입니다.
> 워크플로는 이 브랜치와 `main` 양쪽에서 동작합니다.

## 로컬에서 미리보기

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 내용 채워 넣기

`index.html` 안에 `TODO` 주석으로 표시된 부분이 실제 정보로 교체가 필요한 곳입니다.

| 위치 | 채워야 할 내용 |
|---|---|
| `#about` | 연구실 소개 문구, 통계 숫자(대학원생 수, 논문 수 등) |
| `#research` | 4개 연구 분야(생성형 신약 설계 / 활성·ADMET 예측 / 자율 실험 폐루프 / 구조 기반 설계) — 실제 연구 주제에 맞게 수정 |
| `#people` | 세 분의 정확한 직위, 연구 키워드, 이메일, 프로필 링크 |
| `#people` 하단 | 박사후연구원 · 대학원생 명단 |
| `#publications` | `assets/data/publications.json` 을 수정 (HTML 수정 불필요) |
| `#contact` | 동/호실, 전화번호, 이메일 |

### 논문 추가하기

`assets/data/publications.json` 의 `publications` 배열에 항목을 넣기만 하면 됩니다.
순서는 상관없고 연도별로 자동 정렬됩니다.

```json
{
  "year": 2026,
  "authors": "Author A, Author B, <b>Yuno Lee</b>*",
  "title": "논문 제목",
  "venue": "Journal Name",
  "detail": "17, 139",
  "doi": "10.1186/s13321-025-01047-8"
}
```

- `authors` 안에서 `<b>이름</b>` 으로 감싸면 우리 연구실 저자가 굵게 표시됩니다
- `doi` 는 번호만 넣으면 `https://doi.org/...` 링크가 자동 생성됩니다. DOI가 없으면 `url` 사용
- 최근 `recentYears` (기본 2) 개 연도는 펼쳐지고, 그보다 오래된 연도는
  "이전 논문 N편 펼치기" 버튼으로 접힙니다. 이 값도 같은 파일에서 조정합니다

### 구성원 사진 넣기

1. 사진을 `assets/img/` 에 저장 (예: `assets/img/cho.jpg`, 정사각형 권장)
2. `index.html` 에서 해당 부분을 교체

```html
<!-- 변경 전 -->
<div class="avatar" aria-hidden="true">조</div>

<!-- 변경 후 -->
<img class="avatar-img" src="assets/img/cho.jpg" alt="조남철 박사">
```

### 한국어 / 영어

모든 텍스트가 `data-lang="ko"` / `data-lang="en"` 두 벌로 되어 있고, 우측 상단 `EN` 버튼으로 전환됩니다.
내용을 수정할 때는 **두 언어 모두** 고쳐 주세요.

```html
<span data-lang="ko">한국어 문장</span><span data-lang="en">English sentence</span>
```

### 색상 변경

`assets/css/style.css` 최상단 `:root` 의 `--brand`, `--brand-2` 값만 바꾸면 사이트 전체 톤이 바뀝니다.
다크 모드는 바로 아래 `@media (prefers-color-scheme: dark)` 블록에서 조정합니다.
