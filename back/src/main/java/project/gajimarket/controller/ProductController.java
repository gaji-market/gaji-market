package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.*;
import project.gajimarket.model.file.FileForm;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.util.*;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Slf4j
@Transactional
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final FileService fileService;

    //해시태그 글쓰면 자동작성으로 할건지..
    //로그인 한 사람 찾아와서 넣기는 어떻게 할지..

    //카테고리 전체 정보
    @GetMapping("/categoryInfo")
    public Map<String,Object> categoryInfo(){

        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> categoryInfo = productService.categoryInfo();

        result.put("categoryInfos",categoryInfo);

        return result;
    }

    //팔래요 상품 등록 처리
    @PostMapping("/sellSave")
    public void sellSave(@ModelAttribute ProductDTO productDTO,@ModelAttribute HashTagDTO hashtagDTO,
                         @ModelAttribute CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm,HttpServletRequest request) throws IOException {

        //카테고리
        //프론트에서 받아야될것 - largeCateNo,mediumCateNo,smallCateNo
        categoryDTO.setLargeCateNo(1); //x
        categoryDTO.setMediumCateNo(10); //x
        categoryDTO.setSmallCateNo(100); //x
        //카테고리 선택한 번호가 들어온다 선택한 번호의 categoryNo를 insert해줘야함
        int largeCateNo = categoryDTO.getLargeCateNo();
        int mediumCateNo = categoryDTO.getMediumCateNo();
        int smallCateNo = categoryDTO.getSmallCateNo();
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
        //찾은 카테고리 번호로 상품에 insert
        productDTO.setCategoryNo(findCategoryNo);

        //상품 등록하는 유저의 주소 가져오기
        //로그인한 회원 아이디로 번호를 찾아온다(Session사용)
        //세션 가져오기
        HttpSession session = request.getSession();
        //세션이름으로 들어가있는 아이디를 찾아온다
        Object findSession = session.getAttribute("userInfo");
        //로그인한 아이디로 회원번호 찾기
        int findUserNo = productService.findSessionUser(findSession);
        //유저번호 저장
        productDTO.setUserNo(findUserNo);

        //주소 저장
        String findAddress = productService.findUserAddress(findUserNo);
        productDTO.setAddress(findAddress);

        //입력한 상품 입력
        productDTO.setProdName("팔래요 테스트 상품 이름"); //x
        productDTO.setProdPrice(50000); //x
        productDTO.setPriceOffer("0"); //x
        productDTO.setFreeCheck("0"); //x
        productDTO.setProdExplain("팔래요 테스트 상품 설명입니다"); //x
        //팔래요 상품 등록
        productService.productSellSave(productDTO);

        //해시태그 list로 프론트에서 받아야됨
        List<String> hash= new ArrayList<>(); //x
        hash.add("a"); //x
        hash.add("b"); //x
        hash.add("c"); //x
        hashtagDTO.setTagName(hash); //x
        List<String> tagName1 = hashtagDTO.getTagName();//해시태그 10개를 넣었다면 10개가 들어있다
        for (String tagName : tagName1){
            productService.productHashTagSave(productDTO.getProdNo(),tagName);
        }

        //파일저장 imageFiles로 프론트에서 받아야됨
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
            //DB저장부분
        }
    }

    //살래요 상품 등록 처리
    @PostMapping("/buySave")
    public void buySave(@ModelAttribute ProductDTO productDTO,@ModelAttribute HashTagDTO hashtagDTO,
                        @ModelAttribute CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm, HttpServletRequest request) throws IOException {

        //카테고리
        //프론트에서 받아야될것 - largeCateNo,mediumCateNo,smallCateNo

        //카테고리 선택한 번호가 들어온다 선택한 번호의 categoryNo를 insert해줘야함
        int largeCateNo = categoryDTO.getLargeCateNo();
        int mediumCateNo = categoryDTO.getMediumCateNo();
        int smallCateNo = categoryDTO.getSmallCateNo();
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
        //찾은 카테고리 번호로 상품에 insert
        productDTO.setCategoryNo(findCategoryNo);

        //상품 등록하는 유저의 주소 가져오기
        //로그인한 회원 아이디로 번호를 찾아온다(Session사용)
        //세션 가져오기
        HttpSession session = request.getSession();
        //세션이름으로 들어가있는 아이디를 찾아온다
        Object findSession = session.getAttribute("userInfo");
        //로그인한 아이디로 회원번호 찾기
        int findUserNo = productService.findSessionUser(findSession);
        productDTO.setUserNo(findUserNo);

        String findAddress = productService.findUserAddress(findUserNo);
        productDTO.setAddress(findAddress);

        //입력한 상품 입력
        productDTO.setProdName("살래요 테스트 상품 이름");//x
        productDTO.setProdPrice(50000); //x
        productDTO.setPriceOffer("0"); //x
        productDTO.setFreeCheck("1"); // x
        productDTO.setProdExplain("살래요 테스트 상품 설명입니다"); //x
        //살래요 상품 등록
        productService.productBuySave(productDTO);

        //해시태그 최대10
        List<String> tagName1 = hashtagDTO.getTagName();//해시태그 10개를 넣었다면 10개가 들어있다
        for (String tagName : tagName1){
            productService.productHashTagSave(productDTO.getProdNo(),tagName);
        }

        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
            //DB저장부분
        }
    }

    //이미지 파일 보여주기
    //지수님 마이페이지에서 이미지넘기는 코드 보고 다시 확인
    /**
     * 파일 보여주는부분 다시 확인해보기
     */
    @GetMapping("/images/{filename}")
    public Resource showImage(@PathVariable String filename) throws MalformedURLException {
        //경로에 있는 이미지를 찾아와서 return
        return new UrlResource("file:" + fileService.getFullPath(filename));
    }

    //수정버튼클릭시 이미 입력된 내용 보여주기
    @GetMapping("/{prodNo}/beforeUpdate")
    public Map<String, Object> productBeforeUpdate(@PathVariable int prodNo){

        Map<String,Object> result = new LinkedHashMap<>();

        //prodNo로 보여줄 내용 찾기
        //제목, 가격, 가격제안, 무료나눔, 내용 , 카테고리번호
        Map<String,Object> productInfo= productService.findProductInfo(prodNo);
        result.put("productInfo",productInfo);

        //이미지 index 0- 메인이다 gubun으로 넘겨줘야할듯
        List<Map<String, Object>> fileInfo = productService.findFileInfo(prodNo);
        result.put("fileInfos",fileInfo);

        //카테고리
        int categoryNo = productService.findProdNoByCategoryNo(prodNo);
        Map<String,Object> categoryInfo = productService.findCategoryInfo(categoryNo);
        result.put("categoryInfo",categoryInfo);

        //해시태그
        List<Map<String,Object>> hashTagInfo = productService.findHashTag(prodNo);
        result.put("hashTagInfos",hashTagInfo);

        return result;
    }

    //수정 (이미지, 제목, 가격, 가격제안, 무료나눔, 카테고리, 내용, 해시태그)
    @PostMapping("/{prodNo}/update")
    public void productUpdate(@PathVariable int prodNo,@ModelAttribute ProductDTO productDTO,
                              @ModelAttribute CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm,
                              @ModelAttribute HashTagDTO hashTagDTO,HttpServletRequest request) throws IOException {

        //카테고리 수정
        //카테고리 선택한 번호가 들어온다 선택한 번호의 categoryNo를 insert해줘야함
        int largeCateNo = categoryDTO.getLargeCateNo();
        int mediumCateNo = categoryDTO.getMediumCateNo();
        int smallCateNo = categoryDTO.getSmallCateNo();
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
        productDTO.setCategoryNo(findCategoryNo);

        HttpSession session = request.getSession();
        Object findSession = session.getAttribute("userInfo");
        int findUserNo = productService.findSessionUser(findSession);

        //상품 수정하는 유저의 주소 가져오기(주소가 바꼇을수도 있어서 다시 찾아서 넣어줘야함)
        String findAddress = productService.findUserAddress(findUserNo);
        productDTO.setAddress(findAddress);

        //상품 수정
        productDTO.setProdName("수정제목"); //x
        productDTO.setProdPrice(1234); //x
        productDTO.setPriceOffer("1"); //x
        productDTO.setFreeCheck("1"); //x
        productDTO.setProdExplain("수정한 내용입니다"); //x
        productDTO.setTradState("2");// x
        productService.productUpdate(prodNo,productDTO);
        //상태가 거래중, 거래완료 일때는 다른 글들은 수정불가능하다..

        //이미지 수정
        //저장된 파일이름 가져오기
        List<String> findDBFile = productService.productFindDBFile(prodNo);
        //지정한 경로에 저장된 이미지 삭제
        fileService.fileDelete(findDBFile);
        //DB정보도 삭제해야됨
        productService.productFileDelete(prodNo);
        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++){
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName,dbFileName,prodNo,Integer.toString(i));
            //DB저장부분
        }

        //해시태그 수정
        //prodNo로 먼저 있던 해시태그 삭제
        productService.productHashTagDelete(prodNo);

        //다시 처음부터 해시태그 등록
        List<String> tagName = hashTagDTO.getTagName();
        for (String tag : tagName){
            productService.productHashTagSave(prodNo,tag);
        }
    }

    //팔래요, 살래요 삭제
    @PostMapping("/{prodNo}/delete")
    public void productDelete (@PathVariable int prodNo){
        productService.productDelete(prodNo);
        //Y로만 바꾸고 나머지 데이터도 남겨둔다
    }

    //좋아요 버튼 눌렀을때
    @PostMapping("/{prodNo}/interest")
    public InterestInfoDTO productInterest(@PathVariable int prodNo,InterestInfoDTO interestInfoDTO,HttpServletRequest request){

        interestInfoDTO.setProdNo(prodNo);
        HttpSession session = request.getSession();
        Object id = session.getAttribute("userInfo");
        int userNo = productService.findSessionUser(id);

        //좋아요 클릭한 회원번호 저장
        interestInfoDTO.setUserNo(userNo);
        //좋아요 저장
        productService.interestSave(interestInfoDTO);
        //하나의 유저는 게시물 하나당 좋아요 한개씩 밖에 안된다

        /**
         * //한회원이 게시물에 좋아요를 햇는지 알려줘야한다...json으로 보내면되나?
         */
        InterestInfoDTO interest = productService.findInterest(prodNo,userNo);

        return interest;
    }

    //좋아요 버튼 다시 눌럿을때 삭제
    @PostMapping("/{prodNo}/interestDelete")
    public void productInterestDelete(@PathVariable int prodNo,HttpServletRequest request){
        //로그인한 회원 번호 가져오고
        HttpSession session = request.getSession();
        Object id = session.getAttribute("userInfo");
        int userNo = productService.findSessionUser(id);

        productService.interestDelete(prodNo,userNo);
    }

    //별점정보 입력할때 (구매자 들어가야됨), 구매완료 -> 별점등록 -> 후기작성
    @PostMapping("/{prodNo}/scoreSave")
    public void productScoreSave(@PathVariable int prodNo, ScoreInfoDTO scoreInfoDTO){

        /**
        //판매완료 누르면 산사람 선택해서 들어가야함 , 판매완료 누르면 채팅한사람들 가져오는거 만들어서 데이터 넘겨줘야될거같음
        //산사람 선택은... 채팅한 사람중에 한명 선택하면 그사람의 번호를 가져오면될듯..?
        //update
         freecheck 값을 가져와서 0인지 1인지 본다음에 0이면 채팅한사람 목록 보여주고 선택하게 한뒤 별점쪽으로 넘어가면되고
         1이면 가격높게 제시한사람 한명만 목록을 보여주고 선택하게 한뒤 별점 쪽으로 이동
         */

        //게시글 등록한 사람의 회원 번호가져오기
        int findUserNo = productService.findUserNo(prodNo);
        scoreInfoDTO.setUserNo(findUserNo);
        //상품 번호 저장
        scoreInfoDTO.setProdNo(prodNo);
        //별점 정보 저장 (후기포함)
        scoreInfoDTO.setScore1(5);
        scoreInfoDTO.setTag1("약속을 잘 지켜요");
        scoreInfoDTO.setScore2(4);
        scoreInfoDTO.setTag2("친절해요");
        scoreInfoDTO.setScore3(4);
        scoreInfoDTO.setTag3("물건이 좋아요");
        scoreInfoDTO.setTradeReview("거래후기 테스트");
        //DB 별점 정보 저장
        productService.productScoreSave(scoreInfoDTO);
    }

    //신고 버튼 눌렀을때
    @PostMapping("/{prodNo}/report")
    public void productReport(@PathVariable int prodNo){

        /**
         * //카운트 1증가한것도 Json으로 보내줘야하나??(확인해볼것)
         * 카운트 5되면 자동 삭제?..
         */
        productService.reportCountUp(prodNo);

    }

    //가격 제시 했을때 높은금액으로 update
    @PostMapping("/{prodNo}/priceOffer")
    public void priceOfferUpdate(@PathVariable int prodNo, int offerPrice, HttpServletRequest request){

        //로그인한 회원 아이디로 번호를 찾아온다(Session사용)
        //세션 가져오기
        HttpSession session = request.getSession();
        //세션이름으로 들어가있는 아이디를 찾아온다
        Object findSession = session.getAttribute("userInfo");
        //로그인한 아이디로 회원번호 찾기
        int findUserNo = productService.findSessionUser(findSession);

        //가격 가져오기
        int findPrice = productService.findProductPrice(prodNo);

        //제시한 가격이 높아야지 update
        if (findPrice < offerPrice){
            //가격 높게 제시한사람이 회원번호로 update 하면서 들어온 가격이도 update?
            productService.priceOfferUpdate(offerPrice,findUserNo,prodNo);
        }else {
            //낮은 금액이나 같은 금액 입력하면 프론트쪽에서 막아주면되나?
        }

    }

    //상세보기
    @GetMapping("/{prodNo}")
    public Map<String, Object> productDetail(@PathVariable int prodNo){

        /**
         * 프로필인 판매자 정보도 가져와야함(닉네임,주소,프로필 사진)
         * prodNo로 등록한 사람 정보를 가져와야함
         */

        Map<String,Object> result = new LinkedHashMap<>();

        int userNo = productService.findUserNo(prodNo);
        Map<String,Object> findUserInfo = productService.findUserInfo(userNo);
        result.put("userInfo",findUserInfo);

        //조회수 1증가
        productService.viewCntUpdate(prodNo);

        //좋아요 갯수 가져오기
        Map<String,Object> interestCnt = productService.findInterestCnt(prodNo);
        result.put("interestInfo",interestCnt);

        //prodNo로 보여줄 내용 찾기
        //제목, 가격, 가격제안, 조회수, 무료나눔, 내용 , 주소, 등록날짜, 거래상태
        Map<String,Object> productInfo = productService.findProductInfoDetail(prodNo);
        result.put("productInfo",productInfo);

        //이미지 index 0- 메인이다 gubun으로 넘겨줘야할듯
        List<Map<String,Object>> fileInfo = productService.findFileInfo(prodNo);
        result.put("fileInfos",fileInfo);

        //카테고리
        int categoryNo = productService.findProdNoByCategoryNo(prodNo);
        Map<String,Object> categoryInfo = productService.findCategoryInfo(categoryNo);
        result.put("categoryInfo",categoryInfo);

        //해시태그
        List<Map<String,Object>> hashTagInfo = productService.findHashTag(prodNo);
        result.put("hashTagInfos",hashTagInfo);

        return result;
    }

    //태그 클릭햇을때
    @PostMapping("/{prodNo}/tag")
    public void tag(@PathVariable int prodNo, @RequestParam String tag, HttpServletResponse response) throws IOException {
        /**
         * #태그로 넘어오니까 #을 빼줘야한다 근데 api에 특수 문자가 오면 인식이 안된다? 프론트에서 지워서 와야될듯
         * 아니면 태그를 # 없애고 그냥 글로만 해도댐
         */
        // 팔래요인지, 살래요인지 가져온다
        String findTradeState = productService.findTradeState(prodNo);

        //redirect 할때 한글깨짐
        String enTag = URLEncoder.encode(tag, "UTF-8");

        //만약 팔래요라면
        if (findTradeState.equals("0")){
            //클릭한 태그를 보내준다
            response.sendRedirect("/product/sellAll?search="+enTag);
        }else {
            //살래요라면
            response.sendRedirect("/product/buyAll?search="+enTag);
        }
    }

    //카테고리 클릭햇을때
    @PostMapping("/{prodNo}/category")
    public void tag(@PathVariable int prodNo, HttpServletResponse response) throws IOException {
        //카테고리 번호 찾기
        int findProdNoByCategoryNo = productService.findProdNoByCategoryNo(prodNo);

        // 팔래요인지, 살래요인지 가져온다
        String findTradeState = productService.findTradeState(prodNo);

        //만약 팔래요라면
        if (findTradeState.equals("0")){
            //클릭한 태그를 보내준다
            response.sendRedirect("/product/sellAll?category="+findProdNoByCategoryNo);
        }else {
            //살래요라면
            response.sendRedirect("/product/buyAll?category="+findProdNoByCategoryNo);
        }
    }

    //메인화면에서 카테고리 클릭
    @PostMapping("/category")
    public void category(@RequestParam(required = false) Integer largeCateNo,@RequestParam(required = false) Integer mediumCateNo,
                         @RequestParam(required = false) Integer smallCateNo,
                         HttpServletResponse response, @RequestParam String tradeState) throws IOException {
        //먼저 팔래요선택햇는지, 살래요 선택햇는지를 알아야 어디로 보낼지 정해짐 (팔래요 0, 살래요 1)

        //여성의류 클릭 -> 여성의류 전체
        //여성의류 -> 패딩/점퍼 클릭 largeNo, mediumNo 두개가 넘어와야될듯

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

    //팔래요 전체보기(메인 이미지 1장 ,좋아요, 주소, 가격, 제목,거래상태)
    @GetMapping("/sellAll")
    public Map<String,Object> sellAll(@RequestParam(required = false) String search,@RequestParam(required = false) String sort,
                                      @RequestParam(required = false) Integer category,@RequestParam(required = false) Integer largeCateNo,
                                      @RequestParam(required = false) Integer mediumCateNo,@RequestParam(required = false) Integer smallCateNo){
        /**
         * 판매완료는 안나오게..
         * 등록 날짜로 최신순이지만 수정을 햇다면 수정시간이 최신이 되게 쿼리문....?
         */
        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> findSellAll = productService.findSellAll(search,sort,category,largeCateNo,mediumCateNo,smallCateNo);
        result.put("sellInfos",findSellAll);

        return result;
    }

    //살래요 전체보기(메인 이미지 1장 ,좋아요, 주소, 가격, 제목,거래상태)
    @GetMapping("/buyAll")
    public Map<String,Object> buyAll(@RequestParam(required = false) String search,@RequestParam(required = false) String sort,
                                     @RequestParam(required = false) Integer category,@RequestParam(required = false) Integer largeCateNo,
                                     @RequestParam(required = false) Integer mediumCateNo,@RequestParam(required = false) Integer smallCateNo){
        /**
         * 판매완료는 안나오게..
         * 등록 날짜로 최신순이지만 수정을 햇다면 수정시간이 최신이 되게 쿼리문....?
         */

        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> findBuyAll = productService.findBuyAll(search,sort,category,largeCateNo,mediumCateNo,smallCateNo);
        result.put("buyInfos",findBuyAll);

        return result;
    }
}