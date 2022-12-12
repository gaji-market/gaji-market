package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.gajimarket.dao.*;
import project.gajimarket.model.*;
import project.gajimarket.service.ProductService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;
    private final CategoryDAO categoryDAO;
    private final HashTagDAO hashTagDAO;
    private final FileDAO fileDAO;
    private final InterestDAO interestDAO;
    private final ScoreDAO scoreDAO;

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
        hashTagDAO.productHashTagSave(prodNo,hashTag);
    }

    @Override
    public void productFileSave(String uploadFileName, String dbFilename,int prodNo,String i) {
        fileDAO.productFileSave(uploadFileName,dbFilename,prodNo,i);
    }

    @Override
    public void productUpdate(int prodNo, ProductDTO productDTO) {
        productDAO.productUpdate(prodNo,productDTO);
    }

    @Override
    public List<String> productFindDBFile(int prodNo) {
        return fileDAO.productFindDBFile(prodNo);
    }

    @Override
    public void productFileDelete(int prodNo) {
        fileDAO.productFileDelete(prodNo);
    }

    @Override
    public void productHashTagDelete(int prodNo) {
        hashTagDAO.productHashTagDelete(prodNo);
    }

    @Override
    public List<Map<String, Object>> categoryInfo() {
        return categoryDAO.categoryInfo();
    }

    @Override
    public int findCategoryNo(int largeCateNo, int mediumCateNo, int smallCateNo) {
        return categoryDAO.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
    }

    @Override
    public Map<String, Object> findCategoryInfo(int categoryNo) {
        return categoryDAO.findCategoryInfo(categoryNo);
    }

    @Override
    public Map<String, Object> findProductInfo(int prodNo) {
        return productDAO.findProductInfo(prodNo);
    }


    @Override
    public List<Map<String, Object>> findHashTag(int prodNo) {
        return hashTagDAO.findHashTag(prodNo);
    }

    @Override
    public List<Map<String, Object>> findFileInfo(int prodNo) {
        return fileDAO.findFileInfo(prodNo);
    }

    @Override
    public void interestSave(InterestInfoDTO interestInfoDTO) {
        interestDAO.interestSave(interestInfoDTO);
    }

    @Override
    public void interestDelete(int prodNo, int userNo) {
        interestDAO.interestDelete(prodNo,userNo);
    }

    @Override
    public Integer findInterest(int prodNo, int loginUserNo) {
        return interestDAO.findInterest(prodNo,loginUserNo);
    }

    @Override
    public void reportCountUp(int prodNo) {
        productDAO.reportCountUp(prodNo);
    }

    @Override
    public void productScoreSave(ScoreDTO scoreDTO) {
        scoreDAO.productScoreSave(scoreDTO);
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
        return interestDAO.findInterestCnt(prodNo);
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
    public Map<String, Object> findProductInfoDetail(int prodNo) {
        return productDAO.findProductInfoDetail(prodNo);
    }

    @Override
    public Map<String, Object> findUserInfo(int userNo) {
        return productDAO.findUserInfo(userNo);
    }

    @Override
    public List<Map<String, Object>> findChatUserInfo(int prodNo) {
        return productDAO.findChatUserInfo(prodNo);
    }

    @Override
    public void buyUserUpdate(int userNo, int prodNo) {
        productDAO.buyUserUpdate(userNo,prodNo);
    }
}