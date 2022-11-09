package project.gajimarket.service;

import project.gajimarket.model.Hash_tagDTO;
import project.gajimarket.model.ProductDTO;

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
    void productHashTagSave(Hash_tagDTO hash_tagDTO);

    void productFileSave(String uploadFileName,String dbFilename,int prodNo);

    //void productFindId();

    //void productDelete();

    //void productFindAll();

    //void productUpdate();
}