## 배포 사이트

[가지 마켓](http://gajishop.site/)

## 기술 스택

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" /><img src="https://img.shields.io/badge/styled-components-DB7093?style=flat-square&logo=styled-components&logoColor=white" /><img src="https://img.shields.io/badge/Reduex Tool Kit-764ABC?style=flat-square&logo=Redux&logoColor=white" />
<br />
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
<br />
<img src="https://img.shields.io/badge/Amazon_EC2-FF9900?style=flat-square&logo=Amazon&logoColor=white"/><img src="https://img.shields.io/badge/Amazon_S3-569A31?style=flat-square&logo=&logoColor=white"/>

## 1. 기획 의도=>처음 의도랑 많이 달라져서 한번 의논을 해봐야 할 것 같습니다.

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

<p align="center">

https://user-images.githubusercontent.com/62174495/216546844-6fe1a9fd-dd69-44a4-a832-6c0055626d83.mp4

</p>


<br>

### ⚛ 게시글 등록

<p align="center">

https://user-images.githubusercontent.com/62174495/216548924-937e7de8-e2b8-498d-b7a5-42ac77d62534.mp4

</p>


<br>

### ⚛ 게시글 상세페이지 및 수정

<p align="center"></p>


https://user-images.githubusercontent.com/62174495/216549320-4211db39-358b-4d45-a884-9746be15e9cb.mp4



<br>

### ⚛ 메인페이지

<p align="center">


https://user-images.githubusercontent.com/62174495/216549640-3599b8cf-b1fe-45fe-a7ee-b5cbd16126d2.mp4


</p>

### ⚛ 카테고리 및 검색

<p align="center">


https://user-images.githubusercontent.com/62174495/216549964-995b34f1-9a42-4508-8da3-e46391504dde.mp4


</p>

### ⚛ 메인페이지

<p align="center">


https://user-images.githubusercontent.com/62174495/216549640-3599b8cf-b1fe-45fe-a7ee-b5cbd16126d2.mp4


</p>


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
