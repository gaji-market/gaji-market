## 배포 사이트

[가지 마켓](http://gajishop.site/)

## 기술 스택

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" /><img src="https://img.shields.io/badge/styled-components-DB7093?style=flat-square&logo=styled-components&logoColor=white" /><img src="https://img.shields.io/badge/Reduex Tool Kit-764ABC?style=flat-square&logo=Redux&logoColor=white" />
<br />
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
<br />
<img src="https://img.shields.io/badge/Amazon_EC2-FF9900?style=flat-square&logo=Amazon&logoColor=white"/><img src="https://img.shields.io/badge/Amazon_S3-569A31?style=flat-square&logo=&logoColor=white"/>

## 1. 기획 의도

### 목표

정치인의 과거부터 현재까지의 이슈들을 돌이켜보며 정치인의 스토리, 잠재력, 가치를 깊게 이해할 수 있는 프로덕트를 제공하고자 합니다.

- 정치인 일대기 시각화: 논란, 이슈였던 정치인을 둘러싼 사건들을 시간 순 그래프로 살펴볼 수 있습니다.
- 유저의 평가: 각 사건마다 사용자들이 직접 긍정적, 부정적 평가를 추가할 수 있습니다. 정치인의 인생 여정에서 여론의 평가를 확인할 수 있고, 사용자들 또한 여론을 살펴볼 수 있습니다.

<br>

### 페르소나

- 중고 물품을 사거나 팔고자 하는 사람

<br><br><br>

## 2. 서비스 기능=>아직 게시물이 적고 채팅이 완료되면 그때 적겠습니다.

### ⚛ 로그인

<p align="center"><img src="https://user-images.githubusercontent.com/93570122/201257830-83e405d5-bf57-4686-a444-0010128f9581.gif" height="400"/></p>

- 로그인후 JWT를 이용하여 사용자를 식별

<br>

### ⚛ 메인 페이지

<p align="center"><img src="https://user-images.githubusercontent.com/93570122/201257903-d69ac81c-9dbf-4e6a-8d82-c2c33a76aac2.gif" height="400"/></p>

- 정치인의 전체 이슈를 가져와 인생 전체에 대한 그래프를 볼 수 있습니다.

<br>

### ⚛ 정치인 그래프

<p align="center"><img src="https://user-images.githubusercontent.com/93570122/201257961-063ba4fb-63be-4616-bace-a4b8bbc9ba8e.gif" height="400"/></p>

- 페이지네이션으로 등록된 이슈를 가져와 날짜를 x축에 여론 투표 결과를 Y축에 나타내 선 그래프로 나타내었습니다.
- 부족 별 그래프를 체크박스로 선택할 수 있어 나타내 같은 이슈, 정치인이더라도 부족 간 반응의 차이를 확인 할 수 있습니다.
- 포인트에 마우스를 올리면 O△X 값과 이슈 제목을 나타내는 툴팁을 보여줍니다.
- 포인트 클릭 시 해당 이슈에 투표를 할 수 있는 모달을 띄워 이슈에 대한 평가를 수집합니다.

<br>

### ⚛ 대기 중 이슈

<p align="center"><img src="https://user-images.githubusercontent.com/93570122/201257903-d69ac81c-9dbf-4e6a-8d82-c2c33a76aac2.gif" height="400"/></p>

- 모달을 통해 날짜와 이슈 내용을 입력하고 대기 중 이슈로 등록 가능합니다.
- 무한스크롤으로 대기 중 이슈를 가져오도록 구현했습니다.
- 마감이 임박한 top3 이슈가 상위에 고정되어 보여집니다.

<br><br><br>

## 3. 프로젝트 구성도

### 1. 아키텍쳐=> 다시 그려보기

<p align="center"><img height="400" alt="project architecture" src="https://user-images.githubusercontent.com/102276240/199756858-646fe620-461a-4cb7-8949-efa814787abe.png"></p>

### 4. 폴더구조

#### client

```
src
├─ 📂assets
├─ 📂components
│  ├─ 📂chat
│  ├─ 📂common
│  ├─ 📂Editor
│  └─ 📂Mypage
├─ 📂constants
├─ 📂fonts
├─ 📂layouts
├─ 📂pages
├─ 📂routes
├─ 📂services
├─ 📂store
├─ 📂styles
└─ 📂utils
```

#### server

```
src
├─ 📂main
│  ├─ 📂java
│  │  └─ 📂project
│  │     └─ 📂gajimarket
│  │        ├─ 📂config
│  │        ├─ 📂controller
│  │        ├─ 📂dao
│  │        ├─ 📂model
│  │        │  ├─ 📂file
│  │        ├─ 📂service
│  │        └─ 📂Utils
│  └─ 📂resources
│     ├─ 📂application.properties
│     └─ 📂mapper
```

<br><br><br>

## 4. 팀원 소개 및 역할

| 이름   | 역할 | 담당 부분                                                                                                                                                                                            |
| ------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 강지수 | BE   | 1. Issue API 설계 및 작성 <br> 2. 이슈, 정치인 조회 로직 구현 - pagination, aggregate                                                                                                                |
| 유희주 | BE   | 1. Issue API 설계 및 작성 <br> 2. 이슈 부족별 투표 로직 구현 <br> 3. 이슈 등록 투표 로직 구현 <br> 4. 정치인 목록 로직 구현                                                                          |
| 임건형 | BE   | 1. 카카오 소셜로그인 및 토큰 인증 로직 구현 <br> 2. 로그인한 유저의 이슈에 대한 투표 결과 반영 로직 구현 <br> 3. 유저의 투표 중복 방지 로직 구현 <br> 4. aws 배포 및 github action 활용한 CI&CD 구현 |
| 박선영 | FE   | 1. chartjs를 통한 메인페이지 정치인목록 그래프 작성 <br> 2. Recoil을 통한 전역 상태관리 및 정치인 페이지 이슈 구현 <br> 3. 3. emotion을 이용한 전체 css 및 디자인                                    |
| 이유   | FE   | 1.chartjs를 통한 정치인 상세페이지 구현 <br> 2.chartjs tooltip 직접 구현 <br> 3.chartjs로 페이지네이션 적용 <br> 4.모달 팝업 구현                                                                    |
| 홍주완 | FE   | 1. 로그인 구현 <br> 2. 회원가입 구현 <br> 3. 마이페이지 구현 <br> 4. 토스트창 구현                                                                                                                   |

<br><br><br>

## 5. 커밋 컨벤션

`feat:` 새로운 기능 추가

`refactor:`코드 리팩토링 또는 기존 코드 수정 (기능은 변화X)

`style:` 포매팅(eslint 포매팅 등), 세미콜론 누락 등

`test:` 테스트 코드 추가

`fix:` 버그 수정
