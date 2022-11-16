package project.gajimarket.service;

import project.gajimarket.model.ProductDTO;

import java.util.List;

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
}