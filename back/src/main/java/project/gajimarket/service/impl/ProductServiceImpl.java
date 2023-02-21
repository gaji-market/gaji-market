package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.Utils.JWTUtil;
import project.gajimarket.dao.*;
import project.gajimarket.model.*;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.NotifiService;
import project.gajimarket.service.ProductService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;
    private final CategoryDAO categoryDAO;
    private final HashTagDAO hashTagDAO;
    private final FileDAO fileDAO;
    private final InterestDAO interestDAO;
    private final ScoreDAO scoreDAO;
    private final FileService fileService;
    private final NotifiService notifiService;
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
    public Map<String, Object> productSellSave(Map<String,Object> param, List<MultipartFile> imageFiles) throws IOException {

        try {
            //상품 저장
            ProductDTO productDTO = new ProductDTO();
            productDTO.setCateCode(MapUtils.getString(param,"cateCode"));
            int userNo = loginUserNo(); //로그인한 userNo
            System.out.println("userNo = " + userNo);
            productDTO.setUserNo(userNo);//테스트 유저번호
            String address = productDAO.findUserAddress(userNo);
            productDTO.setAddress(address);

            productDTO.setProdName(MapUtils.getString(param,"prodName"));
            productDTO.setProdPrice(MapUtils.getInteger(param,"prodPrice"));
            productDTO.setProdExplain(MapUtils.getString(param,"prodExplain"));
            productDTO.setFreeCheck(MapUtils.getString(param,"freeCheck"));
            productDTO.setPriceOffer(MapUtils.getString(param,"priceOffer"));
            int result = productDAO.productSellSave(productDTO);

            if (result > 0) {
                //해시태그 저장
                List<String> tagNames = (List<String>) MapUtils.getObject(param,"hashtags");
                for (String tagName : tagNames) {
                    hashTagDAO.productHashTagSave(productDTO.getProdNo(), tagName);
                }
                //파일 저장
                List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
                for (int i = 0; i < storeImageFiles.size(); i++) {
                    String uploadFileName = storeImageFiles.get(i).getUploadFileName();
                    String dbFileName = storeImageFiles.get(i).getDbFileName();
                    fileDAO.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
                }
            }

            return CommonUtil.resultMsg(result);
        }catch (Exception e){
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    //살래요 저장
    @Override
    public Map<String, Object> productBuySave(Map<String,Object> param, List<MultipartFile> imageFiles) throws IOException {

        try {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setCateCode(MapUtils.getString(param,"cateCode"));
            int userNo = loginUserNo();// 로그인한 userNo
            productDTO.setUserNo(userNo);
            String address = productDAO.findUserAddress(userNo);
            productDTO.setAddress(address);

            productDTO.setProdName(MapUtils.getString(param,"prodName"));
            productDTO.setProdPrice(MapUtils.getInteger(param,"prodPrice"));
            productDTO.setProdExplain(MapUtils.getString(param,"prodExplain"));
            productDTO.setFreeCheck(MapUtils.getString(param,"freeCheck"));
            productDTO.setPriceOffer(MapUtils.getString(param,"priceOffer"));
            int result = productDAO.productBuySave(productDTO);

            if (result > 0) {
                //해시태그 저장
                List<String> tagNames = (List<String>) MapUtils.getObject(param,"hashtags");
                for (String tagName : tagNames) {
                    hashTagDAO.productHashTagSave(productDTO.getProdNo(), tagName);
                }

                //파일 저장
                if (imageFiles==null){
                    System.out.println("No image");
                }else {
                    List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
                    for (int i = 0; i < storeImageFiles.size(); i++) {
                        String uploadFileName = storeImageFiles.get(i).getUploadFileName();
                        String dbFileName = storeImageFiles.get(i).getDbFileName();
                        fileDAO.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
                    }
                }
            }

            return CommonUtil.resultMsg(result);
        }catch (Exception e){
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    //상품 수정 전
    @Override
    public Map<String, Object> productBeforeUpdate(int prodNo){

        Map<String,Object> result = new LinkedHashMap<>();

        Map<String, Object> productInfo = productDAO.findProductInfo(prodNo);
        result.put("productInfo",productInfo);

        //이미지 index 0- 메인이다 gubun으로 넘겨줘야할듯
        File file = new File("https://gajimarket.s3.ap-northeast-2.amazonaws.com/0130d1f9-f683-4fb1-b212-829f9bc08a45.jpeg");


        List<Map<String, Object>> fileInfo = fileDAO.findFileInfo(prodNo);
        result.put("fileInfos",fileInfo);
        //result.put("file",file);
        //여기서 파일로 보내줘야한다
//        for (Map<String,Object> file : fileInfo){
//            String dbFileName = (String) file.get("dbFileName");
//
//        }




        //카테고리 정보
        List<Map<String,Object>> categoryInfo = new ArrayList<>();

        String smallCateCode = productDAO.findProdNoByCategoryNo(prodNo);
        String mediumCateCode = categoryDAO.findCateParent(smallCateCode);
        String largeCateCode = categoryDAO.findCateParent(mediumCateCode);

        Map<String,Object> categoryInfo1 = categoryDAO.findCategoryInfo(smallCateCode);
        Map<String,Object> categoryInfo2 = categoryDAO.findCategoryInfo(mediumCateCode);
        Map<String,Object> categoryInfo3 = categoryDAO.findCategoryInfo(largeCateCode);

        categoryInfo.add(categoryInfo3);
        categoryInfo.add(categoryInfo2);
        categoryInfo.add(categoryInfo1);

        result.put("categoryInfos",categoryInfo);

        //해시태그
        List<Map<String,Object>> hashTagInfo = hashTagDAO.findHashTag(prodNo);
        result.put("hashTagInfos",hashTagInfo);

        return result;
    }

    //상품 수정
    @Override
    public Map<String, Object> productUpdate(Map<String,Object> param, List<MultipartFile> imageFiles) throws IOException {
        System.out.println("param = " + param);
        System.out.println("imageFiles = " + imageFiles);
        try {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setCateCode(MapUtils.getString(param,"cateCode"));
            int userNo = loginUserNo(); //로그인한 userNo
            productDTO.setUserNo(userNo);
            String address = productDAO.findUserAddress(userNo);
            productDTO.setAddress(address);

            int prodNo = MapUtils.getInteger(param,"prodNo");

            productDTO.setProdName(MapUtils.getString(param,"prodName"));
            productDTO.setProdPrice(MapUtils.getInteger(param,"prodPrice"));
            productDTO.setProdExplain(MapUtils.getString(param,"prodExplain"));
            productDTO.setFreeCheck(MapUtils.getString(param,"freeCheck"));
            productDTO.setPriceOffer(MapUtils.getString(param,"priceOffer"));
            productDTO.setTradState(MapUtils.getString(param,"tradState"));
            int result = productDAO.productUpdate(prodNo, productDTO);

            //해시태그 삭제
            hashTagDAO.productHashTagDelete(prodNo);
            //해시태그 다시 저장
            List<String> tagNames = (List<String>) MapUtils.getObject(param,"hashtags");
            for (String tagName : tagNames) {
                hashTagDAO.productHashTagSave(prodNo, tagName);
            }

            List<String> findDBFile = fileDAO.productFindDBFile(prodNo);
            fileService.fileDelete(findDBFile);//aws 파일 삭제
            fileDAO.productFileDelete(prodNo);//DB 파일 삭제
            //파일 저장
            List<UploadFile> storeImageFiles = fileService.storeFiles(imageFiles);
            for (int i = 0; i < storeImageFiles.size(); i++) {
                String uploadFileName = storeImageFiles.get(i).getUploadFileName();
                String dbFileName = storeImageFiles.get(i).getDbFileName();
                fileDAO.productFileSave(uploadFileName, dbFileName, prodNo, Integer.toString(i));
            }
            return CommonUtil.resultMsg(result);
        }catch (Exception e){
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    //상품 삭제
    @Override
    public Map<String, Object> productDelete(Map<String,Object> param) {
        try {
            int prodNo = MapUtils.getInteger(param,"prodNo");
            int result = productDAO.productDelete(prodNo);

            return CommonUtil.resultMsg(result);
        }catch (Exception e){
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    //상품 상세 보기
    @Override
    public Map<String,Object> productDetail(int prodNo) {
        Map<String,Object> result = new LinkedHashMap<>();

        //조회수 증가
        viewCountUp(prodNo);

        //상품 등록한 회원 정보 가져오기(닉네임,주소,프로필 사진 이미지)
        int loginUserNo = loginUserNo();
        int userNo = productDAO.findUserNo(prodNo);
        System.out.println("userNo = " + userNo);

        Map<String, Object> userInfo = productDAO.findUserInfo(userNo);
        System.out.println("userInfo = " + userInfo);
        String detailFile = fileDAO.findDetailFile(userNo);
        System.out.println("detailFile = " + detailFile);

        userInfo.put("dbFileName",detailFile);
        userInfo.put("loginUserNo",loginUserNo);

        result.put("userInfo",userInfo);

        //좋아요 정보
        Map<String,Object> interestInfo = new LinkedHashMap<>();
        Integer interestYN = interestDAO.findInterest(prodNo, loginUserNo);
        if (interestYN==null){
            interestInfo.put("interestYN",0);
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
        List<Map<String,Object>> categoryInfo = new ArrayList<>();

        String smallCateCode = productDAO.findProdNoByCategoryNo(prodNo);
        String mediumCateCode = categoryDAO.findCateParent(smallCateCode);
        String largeCateCode = categoryDAO.findCateParent(mediumCateCode);

        Map<String,Object> categoryInfo1 = categoryDAO.findCategoryInfo(smallCateCode);
        Map<String,Object> categoryInfo2 = categoryDAO.findCategoryInfo(mediumCateCode);
        Map<String,Object> categoryInfo3 = categoryDAO.findCategoryInfo(largeCateCode);

        categoryInfo.add(categoryInfo3);
        categoryInfo.add(categoryInfo2);
        categoryInfo.add(categoryInfo1);

        result.put("categoryInfos",categoryInfo);

        //해시태그 정보
        List<Map<String, Object>> hashTagInfo = hashTagDAO.findHashTag(prodNo);
        result.put("hashTagInfos",hashTagInfo);

        return result;
    }

    //좋아요 저장,삭제
    @Override
    public Map<String, Object> interestInsert(Map<String,Object> param) {
        InterestDTO interestDTO = new InterestDTO();

        int prodNo = MapUtils.getInteger(param, "prodNo");
        interestDTO.setProdNo(prodNo);
        System.out.println("prodNo = " + prodNo);

        int loginUserNo = loginUserNo();
        interestDTO.setUserNo(loginUserNo);
        System.out.println("loginUserNo = " + loginUserNo);

        Integer interestYN = interestDAO.findInterest(interestDTO.getProdNo(), interestDTO.getUserNo());
        if (interestYN==null){
            int result = interestDAO.interestSave(interestDTO);
            //좋아요 저장 시 알림 등록
            if (result > 0) {
                UserDTO senderUserDTO = CommonUtil.getUserInfo(request);
                Map<String, Object> map = new HashMap<>();
                map.put("userNo", MapUtils.getInteger(param, "userNo")); // 상품을 등록한 유저
                map.put("senderUserNo", senderUserDTO.getUserNo()); // 좋아요를 클릭한 유저 (로그인한 유저)
                map.put("userNickName", senderUserDTO.getUserNickName());
                map.put("gubun", "2"); // 구분 - 좋아요

                Map<String, Object> resultNotifi = notifiService.addNotification(map);
                log.info(resultNotifi.toString());
            }
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
            interestInfo.put("interestYN",0);
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
    public Map<String, Object> reportCountUp(Map<String,Object> param) {
        try {
            int prodNo = MapUtils.getInteger(param, "prodNo");
            int result = productDAO.reportCountUp(prodNo);

            return CommonUtil.resultMsg(result);
        }catch (Exception e){
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    //팔래요 전체보기
    @Override
    public Map<String,Object> findSellAll(Map<String,Object> result) {
        //sort는 body로 받고, search는 태그 클릭하면 param 으로 넘어오고 검색하면 body로 넘어온다. 검색할때도 param으로 넘겨달라 할것
        //태그 따로 검색 따로
        // param = String tag,Integer category,Integer largeCateNo,Integer mediumCateNo,Integer smallCateNo
        // body = sort,search

        //세션으로 로그인한사람찾기
        int loginUserNo = loginUserNo();
        //로그인 완성되면 로그인 한사람 findSellAll에 넣어서 로그인한 회원이 좋아요한거 찾아줌
        result.put("loginUserNo",loginUserNo);

        //메인화면 카테고리 클릭 메소드
        category(result);

        System.out.println("result = " + result);

        List<Map<String, Object>> sellInfos = productDAO.findSellAll(result);

        SearchPagination searchPagination = (SearchPagination) result.get("body");
        searchPagination.setTotalRecordCount(productDAO.sellCount(result));

        Map<String,Object> result2 = new LinkedHashMap<>();
        result2.put("schPage",searchPagination);
        result2.put("sellInfos",sellInfos);

        return result2;
    }

    //살래요 전체보기
    @Override
    public Map<String,Object> findBuyAll(Map<String,Object> result) {

        //세션으로 로그인한사람찾기
        int loginUserNo = loginUserNo();
        //로그인 완성되면 로그인 한사람 findSellAll에 넣어서 로그인한 회원이 좋아요한거 찾아줌
        result.put("loginUserNo",loginUserNo);

        //메인화면 카테고리 클릭 메소드
        category(result);

        System.out.println("result = " + result);

        List<Map<String, Object>> buyInfos = productDAO.findBuyAll(result);

        SearchPagination searchPagination = (SearchPagination) result.get("body");
        searchPagination.setTotalRecordCount(productDAO.buyCount(result));
        System.out.println("searchPagination = " + searchPagination);

        Map<String,Object> result2 = new LinkedHashMap<>();
        result2.put("schPage",searchPagination);
        result2.put("buyInfos",buyInfos);

        return result2;
    }

    /**
     * 메인화면 카테고리 클릭 메소드
     */
    private void category(Map<String, Object> result) {
        //메인에서 10000을 클릭햇다면?
        Map<String,Object> param = (Map<String, Object>) result.get("param");
        System.out.println("param = " + param);
        String cateParent = (String) param.get("cateCode");
        System.out.println("cateParent = " + cateParent);

        List<String> cateCode = categoryDAO.findCateCode(cateParent);//[10100, 10200, 10300, 10400, 10500]
        System.out.println("cateCode = " + cateCode);
        if (cateParent==null){
            System.out.println("cateCode null");
        }else {
            cateCode.add(cateParent);
            List<String> listCateCode = categoryDAO.findListCateCode(cateCode);//[10101, 10102, 10103, 10104, 10201, 10202, 10501, 10502, 10503]
            System.out.println("listCateCode = " + listCateCode);
            for (int i = 0; i < listCateCode.size(); i++) {
                String arr = listCateCode.get(i);
                cateCode.add(arr);
            }
        }
        System.out.println("cateCode = " + cateCode);

        result.put("cateCode",cateCode);
    }

    /**
     로그인한 유저번호 가지고오기
     */
    private int loginUserNo(){
        Map<String, Object> param = null;

        String headerToken = JWTUtil.getHeaderToken(request);
        System.out.println("Token : " + headerToken);

        // 토큰 복호화
        if (headerToken != null && !"".equals(headerToken)) {
            param = JWTUtil.getTokenInfo(headerToken);
            int userNo = MapUtils.getInteger(param,"userNo");
            return userNo;
        }
        return 0;
    }

    /**
     조회수 중복 방지
     **/
    private void viewCountUp(int prodNo) {

        Cookie oldCookie = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("postView")) {
                    oldCookie = cookie;
                }
            }
        }
        String stringProdNo = Integer.toString(prodNo);

        if (oldCookie != null) {
            if (!oldCookie.getValue().contains("[" + stringProdNo + "]")) {
                productDAO.viewCntUpdate(prodNo);
                oldCookie.setValue(oldCookie.getValue() + "_[" + prodNo + "]");
                oldCookie.setPath("/");
                oldCookie.setMaxAge(60 * 60 * 24);
                response.addCookie(oldCookie);
            }
        } else {
            productDAO.viewCntUpdate(prodNo);
            Cookie newCookie = new Cookie("postView","[" + prodNo + "]");
            newCookie.setPath("/");
            newCookie.setMaxAge(60 * 60 * 24);
            response.addCookie(newCookie);
        }
    }



    /**
     * 아래는 보류 별점 저장쪽
     */
    
    @Override
    public Map<String,Object> productScoreSave(ScoreDTO scoreDTO) {
        System.out.println("scoreDTO = " + scoreDTO);
        try {
            scoreDAO.productScoreSave(scoreDTO);
            productDAO.buyUserUpdate(scoreDTO);
            return CommonUtil.resultMsg(1);
        }catch (Exception e){
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }
}