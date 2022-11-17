package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import project.gajimarket.model.CategoryDTO;
import project.gajimarket.model.HashTagDTO;
import project.gajimarket.model.InterestInfoDTO;
import project.gajimarket.model.ProductDTO;

import java.util.List;

@Mapper
public interface ProductDAO {

    //팔래요 상품 저장
    void productSellSave(ProductDTO productDTO);

    //유저주소가져오기
    String findUserAddress(int userNo);

    //살래요 상품 저장
    void productBuySave(ProductDTO productDTO);

    //팔래요, 살래요 삭제
    void productDelete(int prodNo);

    //해시태그 저장
    void productHashTagSave(int prodNo,String hashTag);

    //파일 업로드
    void productFileSave(String uploadFileName,String DBFilename,int prodNo,String i);

    //상품 수정
    void productUpdate(int prodNo,@Param("dto") ProductDTO productDTO);

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
}