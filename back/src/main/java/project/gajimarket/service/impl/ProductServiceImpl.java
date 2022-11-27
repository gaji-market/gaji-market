package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.gajimarket.dao.ProductDAO;
import project.gajimarket.model.*;
import project.gajimarket.service.ProductService;

import java.util.List;
import java.util.Map;

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

    @Override
    public ProductDTO findProductInfo(int prodNo) {
        return productDAO.findProductInfo(prodNo);
    }

    @Override
    public CategoryDTO findCategoryInfo(int categoryNo) {
        return productDAO.findCategoryInfo(categoryNo);
    }

    @Override
    public List<String> findHashTag(int prodNo) {
        return productDAO.findHashTag(prodNo);
    }

    @Override
    public List<String> findFileInfo(int prodNo) {
        return productDAO.findFileInfo(prodNo);
    }

    @Override
    public void interestSave(InterestInfoDTO interestInfoDTO) {
        productDAO.interestSave(interestInfoDTO);
    }

    @Override
    public void interestDelete(int prodNo, int userNo) {
        productDAO.interestDelete(prodNo,userNo);
    }

    @Override
    public InterestInfoDTO findInterest(int prodNo, int userNo) {
        return productDAO.findInterest(prodNo,userNo);
    }

    @Override
    public void reportCountUp(int prodNo) {
        productDAO.reportCountUp(prodNo);
    }

    @Override
    public void productScoreSave(ScoreInfoDTO scoreInfoDTO) {
        productDAO.productScoreSave(scoreInfoDTO);
    }

    @Override
    public int findUserNo(int prodNo) {
        return productDAO.findUserNo(prodNo);
    }

    @Override
    public int findSessionUser(Object findSession) {
        return productDAO.findSessionUser(findSession);
    }

    @Override
    public int findProductPrice(int prodNo) {
        return productDAO.findProductPrice(prodNo);
    }

    @Override
    public void priceOfferUpdate(int offerPrice, int findUserNo, int prodNo) {
        productDAO.priceOfferUpdate(offerPrice, findUserNo, prodNo);
    }

    @Override
    public void viewCntUpdate(int prodNo) {
        productDAO.viewCntUpdate(prodNo);
    }

    @Override
    public int findInterestCnt(int prodNo) {
        return productDAO.findInterestCnt(prodNo);
    }

    @Override
    public List<Map<String,Object>> findSellAll(String search, String sort,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo) {
        return productDAO.findSellAll(search,sort,category,largeCateNo,mediumCateNo,smallCateNo);
    }

    @Override
    public List<Map<String, Object>> findBuyAll(String search,String sort,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo) {
        return productDAO.findBuyAll(search,sort,category,largeCateNo,mediumCateNo,smallCateNo);
    }

    @Override
    public String findTradeState(int prodNo) {
        return productDAO.findTradeState(prodNo);
    }

    @Override
    public int findProdNoByCategoryNo(int prodNo) {
        return productDAO.findProdNoByCategoryNo(prodNo);
    }

    @Override
    public List<Map<String, Object>> categoryInfo() {
        return productDAO.categoryInfo();
    }
}