package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.*;
import project.gajimarket.service.ProductService;

import java.io.IOException;
import java.util.*;


@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Slf4j
@Transactional
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    @PostMapping(value = "/test",consumes = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public void test(@RequestParam Map<String,Object> param,@RequestBody Map<String,Object> param2){
        System.out.println("param = " + param);
        System.out.println("param2 = " + param2);
    }


    //카테고리 전체 정보
    @GetMapping("/categoryInfo")
    public Map<String,Object> categoryInfo(){
        return productService.categoryInfo();
    }

    //팔래요 상품 등록
    @PostMapping(value = "/sellSave",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public void sellSave(@RequestPart Map<String,Object> param, @RequestPart List<MultipartFile> imageFiles) throws IOException {

        for (MultipartFile imageFile : imageFiles) {
            log.info("imageFiles={}", imageFile.getOriginalFilename());
        }
        log.info("param={}",param);

        //팔래요 상품 등록
        productService.productSellSave(param,imageFiles);

    }

    //살래요 상품 등록
    @PostMapping(value = "/buySave",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public void buySave(@RequestBody Map<String,Object> param,@RequestPart List<MultipartFile> imageFiles) throws IOException {

        for (MultipartFile imageFile : imageFiles) {
            log.info("imageFiles={}", imageFile.getOriginalFilename());
        }
        log.info("param={}",param);

        //살래요 상품 등록
        productService.productBuySave(param, imageFiles);

    }

    //수정버튼클릭시 이미 입력된 내용 보여주기
    @GetMapping("/beforeUpdate/{prodNo}")
    public Map<String, Object> productBeforeUpdate(@PathVariable int prodNo){
        return productService.productBeforeUpdate(prodNo);
    }

    //수정
    @PostMapping(value = "/update",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public void productUpdate(@RequestBody Map<String,Object> param,@RequestPart List<MultipartFile> imageFiles) throws IOException {
        productService.productUpdate(param,imageFiles);
    }

    //팔래요, 살래요 삭제
    @PostMapping("/delete")
    public void productDelete (@RequestBody Map<String,Object> param){
        productService.productDelete(param);
    }

    //상품 상세 보기
    @GetMapping("/{prodNo}")
    public Map<String, Object> productDetail(@PathVariable int prodNo){
        return productService.productDetail(prodNo);
    }

    //좋아요 버튼 눌렀을때
    @PostMapping("/interest")
    public Map<String,Object> productInterest(@RequestBody Map<String,Object> param){
        return productService.interestInsert(param);
    }

    //신고 버튼 눌렀을때
    @PostMapping("/report")
    public void productReport(@RequestBody Map<String,Object> param){
        productService.reportCountUp(param);
    }

    //경매 기능
    @PostMapping("/priceOffer")
    public void priceOfferUpdate(@RequestBody Map<String,Object> param){
        productService.priceOfferUpdate(param);
    }

    //태그 클릭햇을때
    @PostMapping("/tag")
    public void tagClick(@RequestBody Map<String,Object> param) throws IOException {
        productService.tagClick(param);
    }

    //카테고리 클릭햇을때
    @PostMapping("/category")
    public void categoryClick(@RequestBody Map<String,Object> param) throws IOException {
        productService.categoryClick(param);
    }

    //메인화면에서 카테고리 클릭
    @PostMapping("/mainCategory")
    public void category(@RequestBody Map<String,Object> param) throws IOException {
        productService.mainCategoryClick(param);
    }

    //팔래요 전체보기(메인 이미지 1장 ,좋아요, 주소, 가격, 제목,거래상태)
    @PostMapping(value = "/sellAll",consumes = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public Map<String,Object> sellAll(@RequestParam(required = false) Map<String,Object> param,
                                      @RequestBody(required = false) SearchPagination searchPagination){

        Map<String,Object> result = new LinkedHashMap<>();
        result.put("param",param);
        result.put("body",searchPagination);
        return productService.findSellAll(result);

    }

    //살래요 전체보기(메인 이미지 1장 ,좋아요, 주소, 가격, 제목,거래상태)
    @PostMapping(value = "/buyAll",consumes = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public Map<String,Object> buyAll(@RequestParam(required = false) Map<String,Object> param,
                                     @RequestBody(required = false) SearchPagination searchPagination){
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("param",param);
        result.put("body",searchPagination);
        return productService.findBuyAll(result);
    }

    /**
     * 보류
     */
    //판매완료 눌렀을때 채팅한사람 보여주기(닉네임,프로필사진?)
    @GetMapping("/{prodNo}/chat")
    public Map<String,Object> chatInfo(@PathVariable int prodNo){

        Map<String,Object> result = new LinkedHashMap<>();
        List<Map<String,Object>> userInfo = productService.findChatUserInfo(prodNo);
        result.put("userInfos",userInfo);
        return result;
    }
    /**
     * 보류
     */
    //별점이랑 후기 저장
    //채팅한사람 클릭후 여기로 넘어옴 별점정보랑 후기작성 데이터 넘어오면 가지고와서 저장
    @PostMapping("/{prodNo}/scoreSave")
    public void productScoreSave(@PathVariable int prodNo,@ModelAttribute ScoreDTO scoreDTO, @RequestParam int userNo){

        //게시글 등록한 사람의 회원 번호가져오기
        //int findUserNo = productService.findUserNo(prodNo); 보류여서 주석해놈
        //scoreDTO.setUserNo(findUserNo); 보류여서 주석해놈
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
}