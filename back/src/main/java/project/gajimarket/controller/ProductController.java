package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.CategoryDTO;
import project.gajimarket.model.InterestInfoDTO;
import project.gajimarket.model.file.FileForm;
import project.gajimarket.model.HashTagDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.*;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductController {

    private final ProductService productService;
    private final FileService fileService;

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

        //확인해봐야함(나중에)
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
        //확인해봐야함(나중에)
        result.put("살래요 파일 정보",storeImageFiles);

        return result;
    }

    //이미지 파일 보여주기
    //지수님 마이페이지에서 이미지넘기는 코드 보고 다시 확인
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

        //나중에 잘됏는지 확인 필요
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

    //전체보기
    //@GetMapping("")

    //상세보기 (좋아요갯수, 판매자정보 ,제목, 가격, 내용,주소, 날짜, 조회수,이미지 )
    @GetMapping("/{prodNo}")
    public void productDetail(){

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

        //한회원이 게시물에 좋아요를 햇는지 알려줘야한다...json으로 보내면되나?
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

    //별점정보 입력할때 (구매자 들어가야됨)
    @PostMapping("/{prodNo}/scoreSave")
    public void productScoreSave(){

    }

    //신고 버튼 눌렀을때
    @PostMapping("/{prodNo}/report")
    public void productReport(@PathVariable int prodNo){

        //카운트 1증가한것도 Json으로 보내줘야하나??(확인해볼것)
        productService.reportCountUp(prodNo);

    }

    //무료나눔했을때 뭐해야할께 있나?
    //가격 제시 했을때 높은금액으로 update
    //검색기능
    //게시글 정렬
    //구매자 선택 했을때 구현 update

}