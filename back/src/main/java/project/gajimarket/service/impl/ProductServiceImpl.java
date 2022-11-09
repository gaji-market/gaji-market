package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.gajimarket.dao.ProductDAO;
import project.gajimarket.model.Hash_tagDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.service.ProductService;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;

    @Override
    public void productSellSave(ProductDTO productDTO) {
        productDAO.productSellSave(productDTO);
    }

    @Override
    public String findUserAddress(int userNo) {
        return productDAO.findUserAddress(userNo);
    }

    @Override
    public void productBuySave(ProductDTO productDTO) {
        productDAO.productBuySave(productDTO);
    }

    @Override
    public void productDelete(int prodNo) {
        productDAO.productDelete(prodNo);
    }

    @Override
    public void productHashTagSave(Hash_tagDTO hash_tagDTO) {
        productDAO.productHashTagSave(hash_tagDTO);
    }

    @Override
    public void productFileSave(String uploadFileName, String dbFilename,int prodNo) {
        productDAO.productFileSave(uploadFileName,dbFilename,prodNo);
    }
}