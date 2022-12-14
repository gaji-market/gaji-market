package project.gajimarket.service;

import project.gajimarket.model.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface ProductService {

    //팔래요 상품 등록
    void productSellSave(ProductDTO productDTO,Map<String,Object> param,HttpServletRequest request);

    //유저 주소 가져오기
    String findUserAddress(int userNo);

    //살래요 상품 등록
    void productBuySave(ProductDTO productDTO,Map<String,Object> param,HttpServletRequest request);

    //팔래요, 살래요 상품 삭제
    void productDelete(int prodNo);

    //해시태그 저장
    void productHashTagSave(Map<String,Object> param , int prodNo);

    //파일 업로드
    void productFileSave(Map<String,Object> param,int prodNo) throws IOException;

    //상품 수정
    void productUpdate(Map<String,Object> param,ProductDTO productDTO,
                       HttpServletRequest request);

    //상품 번호로 업로드한 파일 찾기
    List<String> productFindDBFile(int prodNo);

    //DB file 테이블 정보 삭제
    void productFileDelete(int prodNo) throws IOException;

    //DB 해시태그 삭제
    void productHashTagDelete(int prodNo);

    //상품 정보 찾기
    Map<String, Object> findProductInfo(int prodNo);

    //전체 카테고리 정보
    Map<String,Object> categoryInfo();

    //카테고리 번호 찾기
    int findCategoryNo(Map<String,Object> param);

    //카테고리 정보 가져오기
    Map<String, Object> findCategoryInfo(int categoryNo);

    //해시태그 정보 가져오기
    List<Map<String, Object>> findHashTag(int prodNo);

    //DB에 저장된 이미지 파일이름 가져오기
    List<Map<String, Object>> findFileInfo(int prodNo);

    //좋아요 저장
    void interestSave(InterestDTO interestInfoDTO);

    //좋아요 삭제
    void interestDelete(int prodNo, int userNo);

    //좋아요 유무 찾기
    Map<String, Object> detailInterest(int prodNo, HttpServletRequest request);

    //신고횟수 증가
    void reportCountUp(int prodNo);

    //별점 정보 저장
    void productScoreSave(ScoreDTO scoreDTO);

    //상품 번호로 회원번호 찾기
    int findUserNo(int prodNo);

    //세션값으로 회원 번호 가져오기
    int findSessionUser(HttpServletRequest request);

    //상품 가격 가져오기
    int findProductPrice(int prodNo);

    //가격 경매 update
    void priceOfferUpdate(int offerPrice, int findUserNo, int prodNo);

    //조회수 증가
    void viewCntUpdate(int prodNo);

    //좋아요 갯수 가져오기
    int findInterestCnt(int prodNo);

    //팔래요 최신순 전체보기
    List<Map<String, Object>> findSellAll(String search,String sort,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo);

    //살래요 최신순 전체보기
    List<Map<String, Object>> findBuyAll(String search,String sort,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo);

    //거래구분 찾기
    String findTradeState(int prodNo);

    //상품번호로 카테고리 번호 찾기
    int findProdNoByCategoryNo(int prodNo);

    //상세보기 상품 가져오기
    Map<String, Object> findProductInfoDetail(int prodNo);

    //상품 상세보기에서 회원정보 가져오기
    Map<String, Object> findUserInfo(Map<String,Object> param);

    //채팅한 사람정보 가져오기
    List<Map<String, Object>> findChatUserInfo(int prodNo);

    //판매완료 후 update
    void buyUserUpdate(int userNo,int prodNo);

    //좋아요 버튼 클릭
    void interestButton(InterestDTO interestInfoDTO,Map<String,Object> param,
                        HttpServletRequest request);
}