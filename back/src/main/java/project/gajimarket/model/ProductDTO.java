package project.gajimarket.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductDTO {
    private int prodNo; //상품번호
    private int userNo; //유저번호
    private int categoryNo; //카테고리번호
    private String prodName; //상품이름
    private int prodPrice; //상품 가격
    private String priceOffer; // 가격제안유무 ('0'-가격제안X,'1'-가격제안O)
    private String freeCheck; // 무료나눔 ('0'-무료나눔X,'1'-무료나눔O)
    private String prodExplain; //상품설명
    private LocalDateTime regDt; //등록일
    private LocalDateTime modDt; //수정일
    private String delYn; //삭제유무
    private int reportCnt; //신고횟수
    private String tradState; //상품 상태값 ('0'-판매중,'1'-사는중,'2'-구매중,'3'-판매완료)
    private int viewCnt; //조횟수
    private String tradeKind; // 거래구분(살래요,팔래요) ('0'-팔래요,'1'-살래요)
    private int buyUserNo; // 구매자 번호
    private int offerPriceNo; // 가격제시한사람
    private String address; // 주소
}