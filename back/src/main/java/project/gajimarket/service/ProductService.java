package project.gajimarket.service;

import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

public interface ProductService {

    //전체 카테고리 정보
    Map<String,Object> categoryInfo();

    //팔래요 상품 등록
    Map<String, Object> productSellSave(Map<String,Object> param,List<MultipartFile> imageFiles) throws IOException;

    //살래요 상품 등록
    Map<String, Object> productBuySave(Map<String,Object> param,List<MultipartFile> imageFiles) throws IOException;

    //상품 수정전
    Map<String, Object> productBeforeUpdate(int prodNo);

    //상품 수정
    Map<String, Object> productUpdate(Map<String,Object> param,List<MultipartFile> imageFiles) throws IOException;

    //팔래요, 살래요 상품 삭제
    Map<String,Object> productDelete(Map<String,Object> param);

    //상품 상세 보기
    Map<String,Object> productDetail(int prodNo);

    //좋아요 버튼 클릭
    Map<String, Object> interestInsert(Map<String,Object> param);

    //신고횟수 증가
    Map<String, Object> reportCountUp(Map<String,Object> param);

    //가격 경매 update
    void priceOfferUpdate(Map<String,Object> param);

    //메인카테고리 클릭
    void mainCategoryClick(Map<String,Object> param) throws IOException;

    //팔래요 최신순 전체보기
    Map<String,Object> findSellAll(Map<String,Object> result);

    //살래요 최신순 전체보기
    Map<String,Object> findBuyAll(Map<String,Object> result);

    //별점 정보 저장
    Map<String,Object> productScoreSave(ScoreDTO scoreDTO);

    /**
     * 아래는 보류
     */
    //채팅한 사람정보 가져오기
    List<Map<String, Object>> findChatUserInfo(int prodNo);

    //태그 클릭
    void tagClick(Map<String,Object> param) throws IOException;

    //카테고리 클릭
    void categoryClick(Map<String,Object> param) throws IOException;


}