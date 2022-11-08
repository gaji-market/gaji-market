package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.ProductDTO;

@Mapper
public interface ProductDAO {

    void productSellSave(ProductDTO productDTO);

    String findUserAddress(int userNo);

    void productBuySave(ProductDTO productDTO);

    void productDelete(int prodNo);
}