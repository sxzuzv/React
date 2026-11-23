# insta 시드 사진 출처 (2026-11-21 확인)

전부 Wikimedia Commons 파일이고 라이선스는 CC0 1.0(퍼블릭 도메인 헌정)입니다. 출처 표시 의무가 없습니다.
라이선스 근거는 각 파일 페이지의 `{{self|cc-zero}}` / `{{cc-zero}}` 표기와 API의 `LicenseShortName: CC0`, `LicenseUrl: https://creativecommons.org/publicdomain/zero/1.0/` 입니다.

| 번호 | 글 내용 | 사진 | 원본 URL | 작가 | 라이선스 | 크기(저장된 픽셀) | 확인일 |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | 성수동 카페 다녀왔어요 | 카페 커피잔(베를린 Café Butter) | https://commons.wikimedia.org/wiki/File:Cup_of_coffee_in_Caf%C3%A9_Butter_-_Prenzlauer_Berg,_Berlin.jpg | Edward (직접 촬영, 업로더 본인) | CC0 1.0 | 4160x4160 | 2026-11-21 |
| 2 | 오늘 점심은 김치찌개 | 김치찌개(샌프란시스코) | https://commons.wikimedia.org/wiki/File:Kimchi_jjigae_-_San_Francisco,_CA.jpg | Daderot (직접 촬영) | CC0 1.0 | 2247x2247 | 2026-11-21 |
| 3 | FastAPI 공부 중 | 노트북과 노트 · 펜 | https://commons.wikimedia.org/wiki/File:Laptop_picture_with_notepad.jpg | Eric Bailey (Startup Stock Photos 원본을 자른 것) | CC0 1.0 (Commons LicenseReview 통과, 검토자 Achim55, 2017-07-30) | 1080x1080 | 2026-11-21 |
| 4 | 주말에 한강 갈 사람? | 한강과 강 건너 스카이라인(노을 무렵) | https://commons.wikimedia.org/wiki/File:Seocho-gu_Skyline_from_Han_River_%E2%80%94_Dec_2023.jpg | SpaceshipMe (직접 촬영) | CC0 1.0 | 4032x3024 | 2026-11-21 |
| 5 | 퇴근길 노을 | 노을 지는 맨해튼 | https://commons.wikimedia.org/wiki/File:Yellow-blue_sunset_over_New_York.jpg | Pierre Blaché (Flickr 원본, FlickreviewR 통과 2024-06-10) | CC0 1.0 | 7000x3938 | 2026-11-21 |
| 6 | 고양이 산책 중 | 걷는 삼색 고양이(수원 행궁동) | https://commons.wikimedia.org/wiki/File:Calico_cat_in_Haenggung-dong,_Suwon_2026.jpg | Gayeong2133 (직접 촬영) | CC0 1.0 | 4032x3024 저장, EXIF 회전 적용 시 3024x4032 세로 | 2026-11-21 |

## 사용 시 주의

- `6.jpg`는 EXIF 방향값(orientation=upper-right)으로 세로 사진이 됩니다. EXIF를 무시하고 자르는 서버 코드(Pillow `Image.open`만 쓰는 경우)는 옆으로 누운 고양이를 만듭니다. `ImageOps.exif_transpose`를 거치는지 확인하세요.
- `5.jpg`는 16:9 가로 사진이라 1080 정사각형으로 자르면 가운데 건물군이 남습니다.
- `2.jpg` `4.jpg` `6.jpg`에는 EXIF GPS 정보가 남아 있습니다.
- `3.jpg` 펜에 작은 상표 글자(PRECISE V5)가 보입니다. 크게 보이지는 않습니다.
- `4.jpg`에는 사람이 없습니다.
- 제외한 후보: Commons의 `(Unsplash)` 표기 파일과 `{{unsplash}}` 라이선스 파일(예: Laptop and coffee on a desk.jpg)은 Unsplash 라이선스 조건이라 뺐습니다.
