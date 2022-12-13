package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.dao.*;
import project.gajimarket.model.*;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.LinkedHashMap;
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
    private final FileService fileService;

    @Override
    public void productSellSave(ProductDTO productDTO,Map<String,Object> param,
                                HttpServletRequest request) {

        int categoryNo = findCategoryNo(param);
        productDTO.setCategoryNo(categoryNo);
        //int userNo = findSessionUser(request);
        int userNo =1;
        productDTO.setUserNo(userNo);//테스트 유저번호
        String address = findUserAddress(userNo);//테스트 유저번호
        productDTO.setAddress(address);

        productDTO.setProdName((String) param.get("prodName"));
        productDTO.setProdPrice((Integer) param.get("prodPrice"));
        productDTO.setProdExplain((String) param.get("prodExplain"));
        productDTO.setFreeCheck((String) param.get("freeCheck"));
        productDTO.setPriceOffer((String) param.get("priceOffer"));
        productDAO.productSellSave(productDTO);
    }

    @Override
    public String findUserAddress(int userNo) {
        return productDAO.findUserAddress(userNo);
    }

    @Override
    public void productBuySave(ProductDTO productDTO,Map<String,Object> param,
                               HttpServletRequest request) {

        int categoryNo = findCategoryNo(param);
        productDTO.setCategoryNo(categoryNo);
        //int userNo = findSessionUser(request);
        int userNo =1;
        productDTO.setUserNo(userNo);//테스트 유저번호
        String address = findUserAddress(userNo);//테스트 유저번호
        productDTO.setAddress(address);

        productDTO.setProdName((String) param.get("prodName"));
        productDTO.setProdPrice((Integer) param.get("prodPrice"));
        productDTO.setProdExplain((String) param.get("prodExplain"));
        productDTO.setFreeCheck((String) param.get("freeCheck"));
        productDTO.setPriceOffer((String) param.get("priceOffer"));
        productDAO.productSellSave(productDTO);
        productDAO.productBuySave(productDTO);
    }

    @Override
    public void productDelete(int prodNo) {
        productDAO.productDelete(prodNo);
    }

    @Override
    public void productHashTagSave(Map<String,Object> param ,int prodNo) {
        List<String> tagNames = (List<String>) param.get("tagName");
        for (String tagName : tagNames){
        hashTagDAO.productHashTagSave(prodNo,tagName);
        }
    }

    @Override
    public void productFileSave(Map<String,Object> param,int prodNo) throws IOException {
        List<MultipartFile> imageFiles = (List<MultipartFile>) param.get("imageFiles");
        List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            fileDAO.productFileSave(uploadFileName,dbFileName, prodNo, Integer.toString(i));
        }
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
    public Map<String, Object> categoryInfo() {
        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> categoryInfo = categoryDAO.categoryInfo();
        result.put("categoryInfos",categoryInfo);
        return result;
    }

    @Override
    public int findCategoryNo(Map<String,Object> param) {
        int largeCateNo = (int) param.get("largeCateNo");
        int mediumCateNo = (int) param.get("mediumCateNo");
        int smallCateNo = (int) param.get("smallCateNo");
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
    public int findSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        Object findSession = session.getAttribute("userInfo");
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