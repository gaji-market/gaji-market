package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.util.MapUtil;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.*;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;


@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Slf4j
@Transactional
@CrossOrigin(origins = {"http://localhost:3000", "http://gajimarket2.s3-website.ap-northeast-2.amazonaws.com"})
public class ProductController {

    private final ProductService productService;

//    @GetMapping("/test")
//    public @ResponseBody byte[] test() throws IOException {
//        InputStream in = getClass().getResourceAsStream("https://gajimarket.s3.ap-northeast-2.amazonaws.com/0130d1f9-f683-4fb1-b212-829f9bc08a45.jpeg");
//        //return IOUtils.toByteArray(in);
//    }

    //카테고리 전체 정보
    @GetMapping("/categoryInfo")
    public Map<String,Object> categoryInfo(){
        return productService.categoryInfo();
    }

    //팔래요 상품 등록
    @PostMapping(value = "/sellSave",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public Map<String,Object> sellSave(@RequestPart Map<String,Object> param, @RequestPart List<MultipartFile> imageFiles) throws IOException {

        for (MultipartFile imageFile : imageFiles) {
            log.info("imageFiles={}", imageFile.getOriginalFilename());
        }
        log.info("param={}",param);

        return productService.productSellSave(param,imageFiles);
    }

    //살래요 상품 등록
    @PostMapping(value = "/buySave",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public Map<String, Object> buySave(@RequestPart Map<String,Object> param, @RequestPart(required = false) List<MultipartFile> imageFiles) throws IOException {

        if (imageFiles==null){
            System.out.println("No image");
        }else {
            for (MultipartFile imageFile : imageFiles) {
                log.info("imageFiles={}", imageFile.getOriginalFilename());
            }
        }
        log.info("param={}",param);

        //살래요 상품 등록
        return productService.productBuySave(param, imageFiles);

    }

    //수정버튼클릭시 이미 입력된 내용 보여주기
    @GetMapping("/beforeUpdate/{prodNo}")
    public Map<String, Object> productBeforeUpdate(@PathVariable int prodNo){
        return productService.productBeforeUpdate(prodNo);
    }

    //수정
    @PostMapping(value = "/update",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public Map<String, Object> productUpdate(@RequestPart Map<String,Object> param, @RequestPart List<MultipartFile> imageFiles) throws IOException {
        return productService.productUpdate(param,imageFiles);
    }

    //팔래요, 살래요 삭제
    @PostMapping("/delete")
    public Map<String,Object> productDelete (@RequestBody Map<String,Object> param){
        return productService.productDelete(param);
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
    public Map<String, Object> productReport(@RequestBody Map<String,Object> param){
        return productService.reportCountUp(param);
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
    @GetMapping(value = "/sellAll")
    public Map<String,Object> sellAll(@RequestParam(required = false) Map<String,Object> param,
                                      @ModelAttribute SearchPagination searchPagination){

        Map<String,Object> result = new LinkedHashMap<>();
        result.put("param",param);
        result.put("body",searchPagination);
        System.out.println("result = " + result);
        return productService.findSellAll(result);

    }

    //살래요 전체보기(메인 이미지 1장 ,좋아요, 주소, 가격, 제목,거래상태)
    @GetMapping(value = "/buyAll")
    public Map<String,Object> buyAll(@RequestParam(required = false) Map<String,Object> param,
                                     @ModelAttribute SearchPagination searchPagination){
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("param",param);
        result.put("body",searchPagination);
        System.out.println("result = " + result);
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
    @PostMapping("/scoreSave")
    public Map<String,Object> productScoreSave(@RequestBody ScoreDTO scoreDTO){
        return productService.productScoreSave(scoreDTO);
    }
}