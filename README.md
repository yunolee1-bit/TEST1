# AI 분자모델링 · 화학정보학 연구실 홈페이지

한국화학연구원(KRICT) · UST-KRICT 스쿨 연구실 홈페이지입니다.
빌드 도구 없이 동작하는 정적 사이트(HTML/CSS/JS)라서, 파일을 수정하고 push 하면 바로 반영됩니다.

## 구조

```
index.html                  # 페이지 전체 (모든 텍스트가 여기에 있습니다)
assets/css/style.css        # 디자인 · 색상 · 반응형
assets/js/main.js           # 한/영 전환, 모바일 메뉴, 스크롤 효과
assets/img/                 # 구성원 사진 등 이미지
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

배포 주소: **https://yunolee1-bit.github.io/TEST1/**

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
| `#research` | 4개 연구 분야 설명 — 실제 연구 주제에 맞게 수정 |
| `#people` | 세 분의 정확한 직위, 연구 키워드, 이메일, 프로필 링크 |
| `#people` 하단 | 박사후연구원 · 대학원생 명단 |
| `#publications` | 실제 논문 목록 (연도별 `.pub-year` 블록 복사해서 추가) |
| `#contact` | 동/호실, 전화번호, 이메일 |

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
