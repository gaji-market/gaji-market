package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.*;
import project.gajimarket.model.file.FileForm;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
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

    //카테고리 전체 정보
    @GetMapping("/categoryInfo")
    public Map<String,Object> categoryInfo(){
        return productService.categoryInfo();
    }

    //팔래요 상품 등록 처리
    @PostMapping("/sellSave")
    public void sellSave(@RequestBody Map<String,Object> param,ProductDTO productDTO,HttpServletRequest request) throws IOException {

        log.info("param={}",param);

        //팔래요 상품 등록
        productService.productSellSave(productDTO,param,request);
        log.info("productDTO={}",productDTO);

        //해시태그 저장
        productService.productHashTagSave(param,productDTO.getProdNo());

        //파일저장
        productService.productFileSave(param,productDTO.getProdNo());

    }

    //살래요 상품 등록 처리
    @PostMapping("/buySave")
    public void buySave(@RequestBody Map<String,Object> param,ProductDTO productDTO, HttpServletRequest request) throws IOException {

        log.info("param={}",param);

        //살래요 상품 등록
        productService.productBuySave(productDTO,param,request);
        log.info("productDTO={}",productDTO);

        //해시태그 저장
        productService.productHashTagSave(param,productDTO.getProdNo());

        //파일저장
        productService.productFileSave(param,productDTO.getProdNo());
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
    public void productUpdate(@PathVariable int prodNo,@RequestBody Map<String,Object> param,
                              HttpServletRequest request,ProductDTO productDTO) throws IOException {

        //카테고리 수정
        //들어온 값으로 category 번호를 찾아야함
        int findCategoryNo = productService.findCategoryNo(param);
        productDTO.setCategoryNo(findCategoryNo);

        int findUserNo = productService.findSessionUser(request);

        //상품 수정하는 유저의 주소 가져오기(주소가 바꼇을수도 있어서 다시 찾아서 넣어줘야함)
        String findAddress = productService.findUserAddress(findUserNo);
        productDTO.setAddress(findAddress);

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
        productService.productFileSave(param,productDTO.getProdNo());

        //해시태그 수정
        //prodNo로 먼저 있던 해시태그 삭제
        productService.productHashTagDelete(prodNo);

        //다시 처음부터 해시태그 등록
        productService.productHashTagSave(param,prodNo);

    }

    //팔래요, 살래요 삭제
    @PostMapping("/{prodNo}/delete")
    public void productDelete (@PathVariable int prodNo){
        productService.productDelete(prodNo);
        //Y로만 바꾸고 나머지 데이터도 남겨둔다
    }

    //좋아요 버튼 눌렀을때
    @PostMapping("/{prodNo}/interest")
    public Map<String,Object> productInterest(@PathVariable int prodNo,InterestInfoDTO interestInfoDTO,HttpServletRequest request){

        interestInfoDTO.setProdNo(prodNo);

        int userNo = productService.findSessionUser(request);

        interestInfoDTO.setUserNo(userNo);

        Integer interestYN = productService.findInterest(prodNo,userNo);
        if (interestYN==null){
            productService.interestSave(interestInfoDTO);
        }else {
            productService.interestDelete(prodNo,userNo);
        }

        Map<String,Object> result = new LinkedHashMap<>();
        Map<String,Object> interestInfo = new LinkedHashMap<>();

        //다시 찾아서 보내줘야하나 일단 만들어놓음
        Integer interest = productService.findInterest(prodNo, userNo);
        if (interest==null){
            interestInfo.put("interestYN",null);
        }else {
            interestInfo.put("interestYN",interestInfo);
        }
        result.put("interestInfo",interestInfo);
        return result;
    }

    //판매완료 눌렀을때 채팅한사람 보여주기(닉네임,프로필사진?)
    @GetMapping("/{prodNo}/chat")
    public Map<String,Object> chatInfo(@PathVariable int prodNo){

        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> userInfo = productService.findChatUserInfo(prodNo);
        result.put("userInfos",userInfo);
        return result;
    }

    //별점이랑 후기 저장
    //채팅한사람 클릭후 여기로 넘어옴 별점정보랑 후기작성 데이터 넘어오면 가지고와서 저장
    @PostMapping("/{prodNo}/scoreSave")
    public void productScoreSave(@PathVariable int prodNo,@ModelAttribute ScoreDTO scoreDTO, @RequestParam int userNo){

        //게시글 등록한 사람의 회원 번호가져오기
        int findUserNo = productService.findUserNo(prodNo);
        scoreDTO.setUserNo(findUserNo);
        //상품 번호 저장
        scoreDTO.setProdNo(prodNo);
        //별점 정보 저장 (후기포함)
        scoreDTO.setScore1(5);
        scoreDTO.setTag1("약속을 잘 지켜요");
        scoreDTO.setScore2(4);
        scoreDTO.setTag2("친절해요");
        scoreDTO.setScore3(4);
        scoreDTO.setTag3("물건이 좋아요");
        scoreDTO.setTradeReview("거래후기 테스트");
        //DB 별점 정보 저장
        productService.productScoreSave(scoreDTO);

        //update (product_info 에서 구매자No에 채팅한사람클릭한거 저장(update))
        //넘어온 userNo로 product update 후 판매완료로 상태변경
        productService.buyUserUpdate(userNo,prodNo);
    }

    //신고 버튼 눌렀을때
    @PostMapping("/{prodNo}/report")
    public void productReport(@PathVariable int prodNo){
        productService.reportCountUp(prodNo);
    }

    //가격 제시 했을때 높은금액으로 update
    @PostMapping("/{prodNo}/priceOffer")
    public void priceOfferUpdate(@PathVariable int prodNo, int offerPrice, HttpServletRequest request){

        //로그인한 아이디로 회원번호 찾기
        int findUserNo = productService.findSessionUser(request);

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
    public Map<String, Object> productDetail(@PathVariable int prodNo,HttpServletRequest request){

        Map<String,Object> result = new LinkedHashMap<>();

        //회원 정보 가져오기(닉네임,주소,프로필 사진 이미지)
        int userNo = productService.findUserNo(prodNo);
        Map<String,Object> findUserInfo = productService.findUserInfo(userNo);
        result.put("userInfo",findUserInfo);

        //조회수 1증가
        productService.viewCntUpdate(prodNo);

        //좋아요 유무
        int loginUserNo = productService.findSessionUser(request);

        Map<String,Object> interestInfo = new LinkedHashMap<>();
        Integer interestYN = productService.findInterest(prodNo,loginUserNo);
        if (interestYN==null){
            interestInfo.put("interestYN",null);
        }else {
            interestInfo.put("interestYN",interestYN);
        }
        //좋아요 갯수 가져오기
        int interestCnt = productService.findInterestCnt(prodNo);
        interestInfo.put("interestCnt",interestCnt);

        result.put("interestInfo",interestInfo);

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
         * body로 넘어오니까 그냥 #만 빼줘도 될거같긴함
         */
        //여기서 #빼주기

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

        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> findBuyAll = productService.findBuyAll(search,sort,category,largeCateNo,mediumCateNo,smallCateNo);
        result.put("buyInfos",findBuyAll);

        return result;
    }
}