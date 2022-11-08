package project.gajimarket.service;

import project.gajimarket.model.ProductDTO;

public interface ProductService {

    //팔래요 상품 등록
    void productSellSave(ProductDTO productDTO);

    String findUserAddress(int userNo);

    void productBuySave(ProductDTO productDTO);

    void productDelete(int prodNo);

    //void productFindId();

    //void productDelete();

    //void productFindAll();

    //void productUpdate();
}