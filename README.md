# 🍆 가지마켓 (Gaji-market)

![가지마켓 메인](https://user-images.githubusercontent.com/48672106/216612371-827e4f10-cbb2-4dcf-8500-33df441a6d9f.png)



`TODO` 가지마켓 설명 들어갈 부분 (논의 후 작성합시다.)

-- --

## 배포 사이트
[가지 마켓](http://gajimarket.shop/)

## 프로젝트 실행 방법

`TODO` 실행 방법 적어야 합니다

## 🍆 폴더구조

### client

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

### server

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

## 사용한 기술 스택

`Frontend`  <br/><br/>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" />
<br/>
<img src="https://img.shields.io/badge/styledcomponents-DB7093?style=flat-square&logo=styled-components&logoColor=white" />
<br/>
<img src="https://img.shields.io/badge/Reduex Tool Kit-764ABC?style=flat-square&logo=Redux&logoColor=white" />

<br/>

`Backend` <br/><br/>
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<br/>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<br/>
<img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
<br/>
<img src="https://img.shields.io/badge/Amazon_EC2-FF9900?style=flat-square&logo=Amazon&logoColor=white"/>
<br/>
<img src="https://img.shields.io/badge/Amazon_S3-569A31?style=flat-square&logo=&logoColor=white"/>

-- --

## 🍆 기획 의도
### 목표

`TODO`

<br>

## 페르소나

- 중고 물품을 사거나 팔고자 하는 사람

<br/>

-- --

# 🍆 가지마켓 기능 소개

### ⚛ 게시글 등록

중고 물품을 구매하거나 판매할 때 등록할 수 있는 에디터입니다. <br/>
이미지는 최대 5장까지 업로드 가능하며, png, gif, jpg 확장자만 등록할 수 있도록 구현하였습니다. <br/>
등록한 이미지는 이미지 슬라이더를 통해 넘겨서 확인할 수 있고, 삭제도 가능합니다. <br/>
`required`로 정의된 인풋 값을 모두 채웠을 때만 폼을 전송할 수 있도록 구현되었습니다. <br/>
팔래요에서는 이미지 1장 이상을 필수로 등록해야하며, 살래요에서는 이미지가 없어도 등록이 가능합니다. <br/>

<p align="center">

https://user-images.githubusercontent.com/62174495/216548924-937e7de8-e2b8-498d-b7a5-42ac77d62534.mp4

</p>


<br>

### ⚛ 게시글 상세페이지 및 수정

등록한 게시글의 이미지, 내용을 수정할 수 있도록 구현하였습니다.

<p align="center"></p>


https://user-images.githubusercontent.com/62174495/216549320-4211db39-358b-4d45-a884-9746be15e9cb.mp4



<br>

### ⚛ 메인페이지 및 살래요/팔래요 전체보기 페이지
메인 페이지에서는 살래요와 팔래요에 등록된 게시글 중 <br/>
좋아요 수가 가장 높은 `인기순`으로 각각 8개의 상품 카드가 노출됩니다. <br/>
살래요, 팔래요 페이지는 메인 페이지 또는 상단 앱 바의 토글을 통해 이동이 가능하며 `무한 스크롤`로 구현하였습니다.

<p align="center">

https://user-images.githubusercontent.com/62174495/216549640-3599b8cf-b1fe-45fe-a7ee-b5cbd16126d2.mp4

</p>

### ⚛ 카테고리 및 검색
사이드 바에서 원하는 카테고리를 클릭하면 해당 카테고리에 등록된 상품 카드만 확인할 수 있습니다. <br/>
검색을 통해서도 원하는 상품 데이터를 찾아볼 수 있도록 구현하였습니다.

<p align="center">


https://user-images.githubusercontent.com/62174495/216549964-995b34f1-9a42-4508-8da3-e46391504dde.mp4

### ⚛ 로그인
로그인, 로그아웃을 할 수 있도록 구현하였습니다. <br/>
JWT 토큰을 이용하였고 로그인이 성공하면 메인 페이지로, 실패하면 토스트 메시지를 띄우는 방식으로 구현하였습니다. <br/> 

<p align="center">


https://user-images.githubusercontent.com/62174495/216546844-6fe1a9fd-dd69-44a4-a832-6c0055626d83.mp4

### ⚛ 회원가입

`TODO`

## 🍆 아키텍쳐

`TODO`

## 🍆 팀원 소개 및 역할

| 이름   | 역할 | 담당 부분                                                                                                                                                                                            |
| ------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 강지수 | BE   | 1. -                                                                                                               |
| 유희주 | BE   | 1. -                                                              |
| 임건형 | BE   | 1. - |
| 박선영 | FE   | 1. -                                  |
| 이유   | FE   | 1. 상품 전체보기 페이지(살래요/팔래요) 구현 <br> 2. 상품 디테일 페이지(살래요/팔래요) 구현 <br> 3. 상품 등록 에디터 구현 <br> 4. UI/UX 및 로고 디자인 <br/>                                                                    |
| 홍주완 | FE   | 1. 로그인 구현 <br> 2. 회원가입 구현 <br> 3. 마이페이지 구현 <br> 4. 토스트창 구현                                                                                                                   |
## 🍆 커밋 컨벤션

`feat:` 새로운 기능 추가

`refactor:` 코드 리팩토링 또는 기존 코드 수정 (기능은 변화X)

`style:` 포매팅(eslint 포매팅 등), 세미콜론 누락 등

`fix:` 버그 수정

`design:` css, styled-components 스타일 수정

## 개선 가능 사항 및 미해결 이슈
`TODO`
