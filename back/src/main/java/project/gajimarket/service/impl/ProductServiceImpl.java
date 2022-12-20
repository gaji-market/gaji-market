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
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
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
    private final HttpServletRequest request;
    private final HttpServletResponse response;

    //카테고리 전체 정보
    @Override
    public Map<String, Object> categoryInfo() {
        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> categoryInfo = categoryDAO.categoryInfo();
        result.put("categoryInfos",categoryInfo);
        return result;
    }

    //팔래요 저장
    @Override
    public void productSellSave(Map<String,Object> param,List<MultipartFile> imageFiles) throws IOException {

        //상품 저장
        ProductDTO productDTO = new ProductDTO();
        int largeCateNo = (int) param.get("largeCateNo");
        int mediumCateNo = (int) param.get("mediumCateNo");
        int smallCateNo = (int) param.get("smallCateNo");
        int categoryNo = categoryDAO.findCategoryNo(largeCateNo, mediumCateNo, smallCateNo);
        productDTO.setCategoryNo(categoryNo);
        //int userNo = findSessionUser(request);
        int userNo =1;
        productDTO.setUserNo(userNo);//테스트 유저번호
        String address = productDAO.findUserAddress(userNo);
        productDTO.setAddress(address);

        productDTO.setProdName((String) param.get("prodName"));
        productDTO.setProdPrice((Integer) param.get("prodPrice"));
        productDTO.setProdExplain((String) param.get("prodExplain"));
        productDTO.setFreeCheck((String) param.get("freeCheck"));
        productDTO.setPriceOffer((String) param.get("priceOffer"));
        productDAO.productSellSave(productDTO);
        //해시태그 저장
        List<String> tagNames = (List<String>) param.get("hashtags");
        for (String tagName : tagNames){
            hashTagDAO.productHashTagSave(productDTO.getProdNo(),tagName);
        }
        //파일 저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            fileDAO.productFileSave(uploadFileName,dbFileName,productDTO.getProdNo(), Integer.toString(i));
        }
    }

    //살래요 저장
    @Override
    public void productBuySave(Map<String,Object> param,List<MultipartFile> imageFiles) throws IOException {
        ProductDTO productDTO = new ProductDTO();

        int largeCateNo = (int) param.get("largeCateNo");
        int mediumCateNo = (int) param.get("mediumCateNo");
        int smallCateNo = (int) param.get("smallCateNo");
        int categoryNo = categoryDAO.findCategoryNo(largeCateNo, mediumCateNo, smallCateNo);
        productDTO.setCategoryNo(categoryNo);
        //int userNo = findSessionUser(request);
        int userNo =1;
        productDTO.setUserNo(userNo);//테스트 유저번호
        String address = productDAO.findUserAddress(userNo);
        productDTO.setAddress(address);

        productDTO.setProdName((String) param.get("prodName"));
        productDTO.setProdPrice((Integer) param.get("prodPrice"));
        productDTO.setProdExplain((String) param.get("prodExplain"));
        productDTO.setFreeCheck((String) param.get("freeCheck"));
        productDTO.setPriceOffer((String) param.get("priceOffer"));
        productDAO.productBuySave(productDTO);
        //해시태그 저장
        List<String> tagNames = (List<String>) param.get("hashtags");
        for (String tagName : tagNames){
            hashTagDAO.productHashTagSave(productDTO.getProdNo(),tagName);
        }
        //파일 저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            fileDAO.productFileSave(uploadFileName,dbFileName,productDTO.getProdNo(), Integer.toString(i));
        }
    }

    //상품 수정 전
    @Override
    public Map<String, Object> productBeforeUpdate(Map<String,Object> param){

        Map<String,Object> result = new LinkedHashMap<>();
        int prodNo = (int) param.get("prodNo");

        Map<String, Object> productInfo = productDAO.findProductInfo(prodNo);
        result.put("productInfo",productInfo);

        //이미지 index 0- 메인이다 gubun으로 넘겨줘야할듯
        List<Map<String, Object>> fileInfo = fileDAO.findFileInfo(prodNo);
        result.put("fileInfos",fileInfo);

        //카테고리
        int categoryNo = productDAO.findProdNoByCategoryNo(prodNo);
        Map<String,Object> categoryInfo = categoryDAO.findCategoryInfo(categoryNo);
        result.put("categoryInfo",categoryInfo);

        //해시태그
        List<Map<String,Object>> hashTagInfo = hashTagDAO.findHashTag(prodNo);
        result.put("hashTagInfos",hashTagInfo);

        return result;
    }

    //상품 수정
    @Override
    public void productUpdate(Map<String,Object> param,List<MultipartFile> imageFiles) throws IOException {
        ProductDTO productDTO = new ProductDTO();
        int largeCateNo = (int) param.get("largeCateNo");
        int mediumCateNo = (int) param.get("mediumCateNo");
        int smallCateNo = (int) param.get("smallCateNo");
        int categoryNo = categoryDAO.findCategoryNo(largeCateNo, mediumCateNo, smallCateNo);
        productDTO.setCategoryNo(categoryNo);
        //int userNo = findSessionUser(request);
        int userNo =1;
        productDTO.setUserNo(userNo);//테스트 유저번호
        String address = productDAO.findUserAddress(userNo);
        productDTO.setAddress(address);

        int prodNo = (int) param.get("prodNo");

        productDTO.setProdName((String) param.get("prodName"));
        productDTO.setProdPrice((Integer) param.get("prodPrice"));
        productDTO.setProdExplain((String) param.get("prodExplain"));
        productDTO.setFreeCheck((String) param.get("freeCheck"));
        productDTO.setPriceOffer((String) param.get("priceOffer"));
        productDTO.setTradState((String) param.get("tradState"));
        productDAO.productUpdate(prodNo,productDTO);

        //해시태그 삭제
        hashTagDAO.productHashTagDelete(prodNo);
        //해시태그 다시 저장
        List<String> tagNames = (List<String>) param.get("hashtags");
        for (String tagName : tagNames){
            hashTagDAO.productHashTagSave(productDTO.getProdNo(),tagName);
        }

        List<String> findDBFile = fileDAO.productFindDBFile(prodNo);
        fileService.fileDelete(findDBFile);//aws 파일 삭제
        fileDAO.productFileDelete(prodNo);//DB 파일 삭제
        //파일 저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            fileDAO.productFileSave(uploadFileName,dbFileName,productDTO.getProdNo(), Integer.toString(i));
        }
    }

    //상품 삭제
    @Override
    public void productDelete(Map<String,Object> param) {
        int prodNo = (int) param.get("prodNo");
        productDAO.productDelete(prodNo);
    }

    //상품 상세 보기
    @Override
    public Map<String,Object> productDetail(Map<String,Object> param) {
        int prodNo = (int) param.get("prodNo");
        Map<String,Object> result = new LinkedHashMap<>();

        //조회수 증가
        productDAO.viewCntUpdate(prodNo);

        //상품 등록한 회원 정보 가져오기(닉네임,주소,프로필 사진 이미지)
        int userNo = productDAO.findUserNo(prodNo);
        Map<String, Object> userInfo = productDAO.findUserInfo(userNo);
        result.put("userInfo",userInfo);

        HttpSession session = request.getSession();
        Object findSession = session.getAttribute("userInfo");
        int loginUserNo = productDAO.findSessionUser(findSession);

        //좋아요 정보
        Map<String,Object> interestInfo = new LinkedHashMap<>();
        Integer interestYN = interestDAO.findInterest(prodNo, loginUserNo);
        if (interestYN==null){
            interestInfo.put("interestYN",null);
        }else {
            interestInfo.put("interestYN",interestYN);
        }
        //좋아요 갯수 가져오기
        int interestCnt = interestDAO.findInterestCnt(prodNo);
        interestInfo.put("interestCnt",interestCnt);
        result.put("interestInfo",interestInfo);

        //상품 정보
        Map<String, Object> productInfo = productDAO.findProductInfoDetail(prodNo);
        result.put("productInfo",productInfo);

        //파일 정보
        List<Map<String, Object>> fileInfo = fileDAO.findFileInfo(prodNo);
        result.put("fileInfos",fileInfo);

        //카테고리 정보
        int categoryNo = productDAO.findProdNoByCategoryNo(prodNo);
        Map<String, Object> categoryInfo = categoryDAO.findCategoryInfo(categoryNo);
        result.put("categoryInfo",categoryInfo);

        //해시태그 정보
        List<Map<String, Object>> hashTagInfo = hashTagDAO.findHashTag(prodNo);
        result.put("hashTagInfos",hashTagInfo);

        return result;
    }

    //좋아요 저장,삭제
    @Override
    public Map<String, Object> interestInsert(Map<String,Object> param) {
        InterestDTO interestDTO = new InterestDTO();

        int prodNo = (int) param.get("prodNo");
        interestDTO.setProdNo(prodNo);

        HttpSession session = request.getSession();
        Object findSession = session.getAttribute("userInfo");
        int loginUserNo = productDAO.findSessionUser(findSession);
        interestDTO.setUserNo(loginUserNo);

        Integer interestYN = interestDAO.findInterest(interestDTO.getProdNo(), interestDTO.getUserNo());
        if (interestYN==null){
            interestDAO.interestSave(interestDTO);
        }else {
            interestDAO.interestDelete(interestDTO.getProdNo(), interestDTO.getUserNo());
        }

        /**
         * 보류 보내야할지 말아야될지 모르겟음
         */
        Map<String,Object> result = new LinkedHashMap<>();
        Map<String,Object> interestInfo = new LinkedHashMap<>();

        Integer interestYN2 = interestDAO.findInterest(prodNo, loginUserNo);
        if (interestYN2==null){
            interestInfo.put("interestYN",null);
        }else {
            interestInfo.put("interestYN",interestYN2);
        }
        //좋아요 갯수 가져오기
        int interestCnt = interestDAO.findInterestCnt(prodNo);
        interestInfo.put("interestCnt",interestCnt);

        result.put("interestInfo",interestInfo);

        return result;
    }

    //신고 버튼
    @Override
    public void reportCountUp(Map<String,Object> param) {
        int prodNo = (int) param.get("prodNo");
        productDAO.reportCountUp(prodNo);
    }

    // 경매 기능
    @Override
    public void priceOfferUpdate(Map<String,Object> param) {
        int prodNo = (int) param.get("prodNo");

        HttpSession session = request.getSession();
        Object findSession = session.getAttribute("userInfo");
        int findUserNo = productDAO.findSessionUser(findSession);

        int offerPrice = (int) param.get("offerPrice"); //넘어온 가격
        int findPrice = productDAO.findProductPrice(prodNo);//원래 상품 가격

        if (findPrice < offerPrice){
            productDAO.priceOfferUpdate(offerPrice,findUserNo,prodNo);
        }
    }

    //태그 클릭
    @Override
    public void tagClick(Map<String,Object> param) throws IOException {
        int prodNo = (int) param.get("prodNo");
        String tag = (String) param.get("tag");
        //redirect 할때 한글깨짐
        String enTag = URLEncoder.encode(tag, "UTF-8");

        // 팔래요인지, 살래요인지 가져온다
        String tradeState = productDAO.findTradeState(prodNo);

        //만약 팔래요라면
        if (tradeState.equals("0")){
            //클릭한 태그를 보내준다
            response.sendRedirect("/product/sellAll?search="+enTag);
        }else {
            //살래요라면
            response.sendRedirect("/product/buyAll?search="+enTag);
        }
    }

    //카테고리 클릭
    @Override
    public void categoryClick(Map<String,Object> param) throws IOException {
        int prodNo = (int) param.get("prodNo");

        int categoryNo = productDAO.findProdNoByCategoryNo(prodNo);
        String tradeState = productDAO.findTradeState(prodNo);

        //만약 팔래요라면
        if (tradeState.equals("0")){
            //클릭한 태그를 보내준다
            response.sendRedirect("/product/sellAll?category="+categoryNo);
        }else {
            //살래요라면
            response.sendRedirect("/product/buyAll?category="+categoryNo);
        }
    }

    //메인카테고리 클릭
    public void mainCategoryClick(Map<String,Object> param) throws IOException {
        String tradeState = (String) param.get("tradeState");
        Integer largeCateNo = (Integer) param.get("largeCateNo");
        Integer mediumCateNo = (Integer) param.get("mediumCateNo");
        Integer smallCateNo = (Integer) param.get("smallCateNo");

        //팔래요라면
        if (tradeState.equals("0")) {
            if (largeCateNo != null && mediumCateNo == null && mediumCateNo == null) {
                response.sendRedirect("/product/sellAll?largeCateNo="+largeCateNo);
            } else if (largeCateNo != null && mediumCateNo != null && smallCateNo == null) {
                response.sendRedirect("/product/sellAll?largeCateNo="+largeCateNo+"&&"+"mediumCateNo="+mediumCateNo);
            } else if (largeCateNo != null && mediumCateNo != null && smallCateNo != null){
                response.sendRedirect("/product/sellAll?largeCateNo="+largeCateNo+"&&"+"mediumCateNo="+mediumCateNo+"&&"+"smallCateNo="+smallCateNo);
            }
            //살래요라면
        }else if (tradeState.equals("1")){
            if (largeCateNo != null && mediumCateNo == null && mediumCateNo == null) {
                response.sendRedirect("/product/buyAll?largeCateNo="+largeCateNo);
            } else if (largeCateNo != null && mediumCateNo != null && smallCateNo == null) {
                response.sendRedirect("/product/buyAll?largeCateNo="+largeCateNo+"&&"+"mediumCateNo="+mediumCateNo);
            } else if (largeCateNo != null && mediumCateNo != null && smallCateNo != null){
                response.sendRedirect("/product/buyAll?largeCateNo="+largeCateNo+"&&"+"mediumCateNo="+mediumCateNo+"&&"+"smallCateNo="+smallCateNo);
            }
        }
    }

    //팔래요 전체보기
    @Override
    public Map<String,Object> findSellAll(String search, String sort,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo) {
        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> sellInfos = productDAO.findSellAll(search, sort, category, largeCateNo, mediumCateNo, smallCateNo);
        result.put("sellInfos",sellInfos);
        return result;
    }

    //살래요 전체보기
    @Override
    public Map<String,Object> findBuyAll(String search,String sort,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo) {
        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> buyInfos = productDAO.findBuyAll(search, sort, category, largeCateNo, mediumCateNo, smallCateNo);
        result.put("buyInfos",buyInfos);
        return result;
    }

    /**
     * 아래는 보류 별점 저장쪽
     */

    @Override
    public void productScoreSave(ScoreDTO scoreDTO) {
        scoreDAO.productScoreSave(scoreDTO);
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