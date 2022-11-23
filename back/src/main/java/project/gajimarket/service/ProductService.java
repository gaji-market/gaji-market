package project.gajimarket.service;

import project.gajimarket.model.*;

import java.util.List;
import java.util.Map;

public interface ProductService {

    //팔래요 상품 등록
    void productSellSave(ProductDTO productDTO);

    //유저 주소 가져오기
    String findUserAddress(int userNo);

    //살래요 상품 등록
    void productBuySave(ProductDTO productDTO);

    //팔래요, 살래요 상품 삭제
    void productDelete(int prodNo);

    //해시태그 저장
    void productHashTagSave(int prodNo,String hashTag);

    //파일 업로드
    void productFileSave(String uploadFileName,String dbFilename,int prodNo,String i);

    //상품 수정
    void productUpdate(int prodNo,ProductDTO productDTO);

    //상품 번호로 업로드한 파일 찾기
    List<String> productFindDBFile(int prodNo);

    //DB file 테이블 정보 삭제
    void productFileDelete(int prodNo);

    //DB 해시태그 삭제
    void productHashTagDelete(int prodNo);

    //카테고리 번호 찾기
    int findCategoryNo(int largeCateNo, int mediumCateNo, int smallCateNo);

    //상품 정보 찾기
    ProductDTO findProductInfo(int prodNo);

    //카테고리 정보 가져오기
    CategoryDTO findCategoryInfo(int categoryNo);

    //해시태그 정보 가져오기
    List<String> findHashTag(int prodNo);

    //DB에 저장된 이미지 파일이름 가져오기
    List<String> findFileInfo(int prodNo);

    //좋아요 저장
    void interestSave(InterestInfoDTO interestInfoDTO);

    //좋아요 삭제
    void interestDelete(int prodNo, int userNo);

    //좋아요 찾기
    InterestInfoDTO findInterest(int prodNo, int userNo);

    //신고횟수 증가
    void reportCountUp(int prodNo);

    //별점 정보 저장
    void productScoreSave(ScoreInfoDTO scoreInfoDTO);

    //상품 번호로 회원번호 찾기
    int findUserNo(int prodNo);

    //세션값으로 회원 번호 가져오기
    int findSessionUser(Object findSession);

    //상품 가격 가져오기
    int findProductPrice(int prodNo);

    //가격 경매 update
    void priceOfferUpdate(int offerPrice, int findUserNo,int prodNo);

    //조회수 증가
    void viewCntUpdate(int prodNo);

    //좋아요 갯수 가져오기
    int findInterestCnt(int prodNo);

    //팔래요 최신순 전체보기
    List<Map<String,Object>> findSellAll(String search);

    //살래요 최신순 전체보기
    List<Map<String, Object>> findBuyAll(String search);

    //거래구분 찾기
    String findTradeState(int prodNo);

    //팔래요 가격 높은순
    List<Map<String, Object>> findSellHighPrice();


}