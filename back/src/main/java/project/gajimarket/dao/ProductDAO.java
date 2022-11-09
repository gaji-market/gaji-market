package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.Hash_tagDTO;
import project.gajimarket.model.ProductDTO;

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
    void productHashTagSave(Hash_tagDTO hash_tagDTO);

    void productFileSave(String uploadFileName,String DBFilename);
}