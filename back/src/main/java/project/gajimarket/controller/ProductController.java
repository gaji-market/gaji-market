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
public class ProductController {

    private final ProductService productService;
    private final FileService fileService;

    //상품 등록할때 카테고리 선택해야되니까 카테고리 정보 보내줘야하나?and 메인에서도 카테고리 정보 필요함
    //검색기능에서 /슬래시 오는것는 어떻게 뺄건지.. 스페이스바도.. 기타도..



    //팔래요 상품 등록 처리
    @PostMapping("/sellSave")
    public Map<String,Object> sellSave(ProductDTO productDTO, HashTagDTO hashtagDTO, CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm) throws IOException {

        Map<String,Object> result = new LinkedHashMap<>();

        //카테고리
        categoryDTO.setLargeCateNo(1);
        categoryDTO.setMediumCateNo(10);
        categoryDTO.setSmallCateNo(100);
        //카테고리 선택한 번호가 들어온다 선택한 번호의 categoryNo를 insert해줘야함
        int largeCateNo = categoryDTO.getLargeCateNo();
        int mediumCateNo = categoryDTO.getMediumCateNo();
        int smallCateNo = categoryDTO.getSmallCateNo();
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
        //찾은 카테고리 번호로 상품에 insert
        productDTO.setCategoryNo(findCategoryNo);

        //상품 등록하는 유저의 주소 가져오기
        String findAddress = productService.findUserAddress(1);
        productDTO.setAddress(findAddress);

        //입력한 상품 입력
        productDTO.setUserNo(1);
        productDTO.setProdName("팔래요 테스트 상품 이름");
        productDTO.setProdPrice(50000);
        productDTO.setPriceOffer("0");
        productDTO.setFreeCheck("0");
        productDTO.setProdExplain("팔래요 테스트 상품 설명입니다");
        //팔래요 상품 등록
        productService.productSellSave(productDTO);
        result.put("팔래요 상품 정보",productDTO);

        //해시태그 최대10
        List<String> hash= new ArrayList<>();
        hash.add("a");
        hash.add("b");
        hash.add("c");
        hashtagDTO.setTagName(hash);
        List<String> tagName1 = hashtagDTO.getTagName();//해시태그 10개를 넣었다면 10개가 들어있다
        for (String tagName : tagName1){
            productService.productHashTagSave(productDTO.getProdNo(),tagName);
        }
        //해시태그 10개를 저장
        result.put("팔래요 해시태그 정보",hashtagDTO);

        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
            //DB저장부분
        }

        /**
         * //확인해봐야함(나중에)
         */
        result.put("팔래요 파일 정보",storeImageFiles);

        return result;
    }

    //살래요 상품 등록 처리
    @PostMapping("/buySave")
    public Map<String,Object> buySave(ProductDTO productDTO, HashTagDTO hashtagDTO, CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm) throws IOException {

        Map<String,Object> result = new LinkedHashMap<>();

        //카테고리
        //카테고리 선택한 번호가 들어온다 선택한 번호의 categoryNo를 insert해줘야함
        int largeCateNo = categoryDTO.getLargeCateNo();
        int mediumCateNo = categoryDTO.getMediumCateNo();
        int smallCateNo = categoryDTO.getSmallCateNo();
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
        //찾은 카테고리 번호로 상품에 insert
        productDTO.setCategoryNo(findCategoryNo);

        //상품 등록하는 유저의 주소 가져오기
        String findAddress = productService.findUserAddress(1);
        productDTO.setAddress(findAddress);

        //입력한 상품 입력
        productDTO.setUserNo(1);
        productDTO.setCategoryNo(1);
        productDTO.setProdName("살래요 테스트 상품 이름");
        productDTO.setProdPrice(50000);
        productDTO.setPriceOffer("0");
        productDTO.setFreeCheck("1"); // 무료나눔 -> 1
        productDTO.setProdExplain("살래요 테스트 상품 설명입니다");
        //살래요 상품 등록
        productService.productBuySave(productDTO);
        result.put("살래요 상품 정보",productDTO);

        //해시태그 최대10
        List<String> tagName1 = hashtagDTO.getTagName();//해시태그 10개를 넣었다면 10개가 들어있다
        for (String tagName : tagName1){
            productService.productHashTagSave(productDTO.getProdNo(),tagName);
        }
        //해시태그 10개를 저장
        result.put("살래요 해시태그 정보",hashtagDTO);

        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
            //DB저장부분
        }
        /**
         * //확인해봐야함(나중에)
         */
        result.put("살래요 파일 정보",storeImageFiles);

        return result;
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
    public Map<String, Object> productBeforeUpdate(@PathVariable int prodNo) throws IOException {

        Map<String,Object> result = new LinkedHashMap<>();

        //prodNo로 보여줄 내용 찾기
        //제목, 가격, 가격제안, 무료나눔, 내용 , 카테고리번호
        ProductDTO productDTO = productService.findProductInfo(prodNo);
        int categoryNo = productDTO.getCategoryNo();

        result.put("제목",productDTO.getProdName());
        result.put("가격",productDTO.getProdPrice());
        result.put("가격제안",productDTO.getPriceOffer());
        result.put("무료나눔",productDTO.getFreeCheck());
        result.put("내용",productDTO.getProdExplain());

        //이미지 index 0- 메인이다 gubun으로 넘겨줘야할듯
        List<String> findFile =productService.findFileInfo(prodNo);
        log.info("findFile={}",findFile);
        result.put("메인이미지 = 0",findFile.get(0));
        result.put("이미지 = 1",findFile.get(1));
        result.put("이미지 = 2",findFile.get(2));
        result.put("이미지 = 3",findFile.get(3));
        result.put("이미지 = 4",findFile.get(4));

        //카테고리
        CategoryDTO categoryDTO = productService.findCategoryInfo(categoryNo);
        result.put("대분류",categoryDTO.getLargeCateNo());
        result.put("중분류",categoryDTO.getMediumCateNo());
        result.put("소분류",categoryDTO.getSmallCateNo());

        //해시태그
        List<String> tagName = productService.findHashTag(prodNo);
        result.put("태그",tagName);

        return result;
    }


    //수정 (이미지, 제목, 가격, 가격제안, 무료나눔, 카테고리, 내용, 해시태그)
    @PostMapping("/{prodNo}/update")
    public Map<String,Object> productUpdate(@PathVariable int prodNo, ProductDTO productDTO,CategoryDTO categoryDTO, FileForm fileForm, HashTagDTO hashTagDTO) throws IOException {

        Map<String,Object> result = new LinkedHashMap<>();

        //카테고리 수정
        //카테고리 선택한 번호가 들어온다 선택한 번호의 categoryNo를 insert해줘야함
        int largeCateNo = categoryDTO.getLargeCateNo();
        int mediumCateNo = categoryDTO.getMediumCateNo();
        int smallCateNo = categoryDTO.getSmallCateNo();
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(largeCateNo,mediumCateNo,smallCateNo);
        productDTO.setCategoryNo(findCategoryNo);

        //상품 수정하는 유저의 주소 가져오기(주소가 바꼇을수도 있어서 다시 찾아서 넣어줘야함)
        String findAddress = productService.findUserAddress(1);
        productDTO.setAddress(findAddress);

        //상품 수정
        productDTO.setProdName("수정제목");
        productDTO.setProdPrice(1234);
        productDTO.setPriceOffer("1");
        productDTO.setFreeCheck("1");
        productDTO.setProdExplain("수정한 내용입니다");
        productDTO.setTradState("2");//거래중,거래완료 수정
        productService.productUpdate(prodNo,productDTO);
        //상태가 거래중, 거래완료 일때는 다른 글들은 수정불가능하다..
        result.put("수정 상품 정보",productDTO);

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

        /**
         * //나중에 잘됏는지 확인 필요
         */
        result.put("수정 파일 정보",storeImageFiles);

        //해시태그 수정
        //prodNo로 먼저 있던 해시태그 삭제
        productService.productHashTagDelete(prodNo);

        //다시 처음부터 해시태그 등록
        List<String> tagName = hashTagDTO.getTagName();
        for (String tag : tagName){
            productService.productHashTagSave(prodNo,tag);
        }
        result.put("수정 해시태그 정보",hashTagDTO);

        return result;
    }

    //팔래요, 살래요 삭제
    @PostMapping("/{prodNo}/delete")
    public void productDelete (@PathVariable int prodNo){
        productService.productDelete(prodNo);
        //Y로만 바꾸고 나머지 데이터도 남겨둔다
    }

    //좋아요 버튼 눌렀을때
    @PostMapping("/{prodNo}/interest")
    public InterestInfoDTO productInterest(@PathVariable int prodNo, InterestInfoDTO interestInfoDTO){

        interestInfoDTO.setProdNo(prodNo);
        //회원번호가져오고
        int userNo = 1;
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
    public void productInterestDelete(@PathVariable int prodNo){
        //회원 번호 가져오고
        int userNo = 1;
        productService.interestDelete(prodNo,userNo);
    }

    //별점정보 입력할때 (구매자 들어가야됨), 구매완료 -> 별점등록 -> 후기작성
    @PostMapping("/{prodNo}/scoreSave")
    public void productScoreSave(@PathVariable int prodNo, ScoreInfoDTO scoreInfoDTO){

        /**
        //판매완료 누르면 산사람 선택해서 들어가야함
        //산사람 선택은... 채팅한 사람중에 한명 선택하면 그사람의 번호를 가져오면될듯..?
        //update
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
        Object findSession = session.getAttribute("넘어온세션이름");
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
         * 프로필인 판매자 정보도 가져와야함
         */

        //조회수 1증가
        productService.viewCntUpdate(prodNo);

        Map<String,Object> result = new LinkedHashMap<>();

        //좋아요 갯수 가져오기
        int findInterestCnt = productService.findInterestCnt(prodNo);
        result.put("좋아요 갯수",findInterestCnt);

        //prodNo로 보여줄 내용 찾기
        //제목, 가격, 가격제안, 무료나눔, 내용 , 카테고리번호, 주소, 등록날짜, 거래상태, 해시태그
        ProductDTO productDTO = productService.findProductInfo(prodNo);
        int categoryNo = productDTO.getCategoryNo();
        result.put("상품 정보",productDTO);

        //이미지 index 0- 메인이다 gubun으로 넘겨줘야할듯
        List<String> findFile =productService.findFileInfo(prodNo);
        log.info("findFile={}",findFile);
        result.put("메인이미지 = 0",findFile.get(0));
        result.put("이미지 = 1",findFile.get(1));
        result.put("이미지 = 2",findFile.get(2));
        result.put("이미지 = 3",findFile.get(3));
        result.put("이미지 = 4",findFile.get(4));

        //카테고리
        CategoryDTO categoryDTO = productService.findCategoryInfo(categoryNo);
        result.put("대분류",categoryDTO.getLargeCateNo());
        result.put("중분류",categoryDTO.getMediumCateNo());
        result.put("소분류",categoryDTO.getSmallCateNo());

        //해시태그
        List<String> tagName = productService.findHashTag(prodNo);
        result.put("태그",tagName);

        return result;
    }

    //태그 클릭햇을때
    @GetMapping("/{prodNo}/tag")
    public void tag(@PathVariable int prodNo, @RequestParam String tag, HttpServletResponse response) throws IOException {
        log.info("tag={}",tag);
        /**
         * #태그로 넘어오니까 #을 빼줘야한다 근데 api에 특수 문자가 오면 인식이 안된다? 프론트에서 지워서 오면 좋겟다
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
    @GetMapping("/{prodNo}/category")
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

    //메인창에서 카테고리 클릭했을때도 만들어야함(여성의류를 클릭하면 where LargeName='여성의류' 인거를 다 보여주면됨)
    //근데 정렬로 해야됨 그냥 sellAll로 보낼수 있을까
    //팔래요로 보낼지 살래요로 보낼지
    @GetMapping("/category")
    public void category(@RequestParam(required = false) Integer largeCateNo,@RequestParam(required = false) Integer mediumCateNo,
                         @RequestParam(required = false) Integer smallCateNo,
                         HttpServletResponse response, @RequestParam String tradeState) throws IOException {
        //먼저 팔래요선택햇는지, 살래요 선택햇는지를 알아야 어디로 보낼지 정해짐

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
        result.put("팔래요 정보",findSellAll);

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

        //choose로 가격 높은순, 낮은순 , 좋아요 높은순 , 조회수 높은순 값이 넘어온다면?

        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> findBuyAll = productService.findBuyAll(search,sort,category,largeCateNo,mediumCateNo,smallCateNo);
        result.put("살래요 정보",findBuyAll);

        return result;
    }
}