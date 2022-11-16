package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.gajimarket.dao.ProductDAO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.service.ProductService;

import java.util.List;

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
    public void productHashTagSave(int prodNo,String hashTag) {
        productDAO.productHashTagSave(prodNo,hashTag);
    }

    @Override
    public void productFileSave(String uploadFileName, String dbFilename,int prodNo,String i) {
        productDAO.productFileSave(uploadFileName,dbFilename,prodNo,i);
    }

    @Override
    public void productUpdate(int prodNo, ProductDTO productDTO) {
        productDAO.productUpdate(prodNo,productDTO);
    }

    @Override
    public List<String> productFindDBFile(int prodNo) {
        return productDAO.productFindDBFile(prodNo);
    }

    @Override
    public void productFileDelete(int prodNo) {
        productDAO.productFileDelete(prodNo);
    }

    @Override
    public void productHashTagDelete(int prodNo) {
        productDAO.productHashTagDelete(prodNo);
    }

    @Override
    public int findCategoryNo(int largeCateNo, int mediumCateNo, int smallCateNo) {
        return productDAO.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
    }
}