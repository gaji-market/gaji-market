package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
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

    //업로드한 이미지 파일 삭제
    int findCategoryNo(int largeCateNo, int mediumCateNo, int smallCateNo);
}