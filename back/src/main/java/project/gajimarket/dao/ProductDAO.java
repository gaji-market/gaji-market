package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import project.gajimarket.model.Hash_tagDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.file.FileDTO;
import project.gajimarket.model.file.FileForm;

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
    void productHashTagSave(Hash_tagDTO hash_tagDTO);

    //파일 업로드
    void productFileSave(String uploadFileName,String DBFilename,int prodNo,String i);

    //상품 수정
    void productUpdate(int prodNo,@Param("dto") ProductDTO productDTO);

    //상품 번호로 업로드한 파일 찾기
    List<String> productFindDBFile(int prodNo);

    void productFileDelete(int prodNo);
}