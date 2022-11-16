package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.CategoryDTO;
import project.gajimarket.model.file.FileForm;
import project.gajimarket.model.HashTagDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final FileService fileService;

    //팔래요 상품 등록 처리
    @PostMapping("/sellSave")
    public ProductDTO sellSave(ProductDTO productDTO, HashTagDTO hashtagDTO, CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm) throws IOException {

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
        productDTO.setProdName("팔래요 테스트 상품 이름");
        productDTO.setProdPrice(50000);
        productDTO.setPriceOffer("0");
        productDTO.setFreeCheck("0");
        productDTO.setProdExplain("팔래요 테스트 상품 설명입니다");
        //팔래요 상품 등록
        productService.productSellSave(productDTO);

        //해시태그 최대10
        List<String> tagName1 = hashtagDTO.getTagName();//해시태그 10개를 넣었다면 10개가 들어있다
        for (String tagName : tagName1){
            productService.productHashTagSave(productDTO.getProdNo(),tagName);
        }
        //해시태그 10개를 저장

        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
            //DB저장부분
        }

        return productDTO;
    }

    //살래요 상품 등록 처리
    @PostMapping("/buySave")
    public ProductDTO buySave(ProductDTO productDTO, HashTagDTO hashtagDTO, CategoryDTO categoryDTO,@ModelAttribute FileForm fileForm) throws IOException {

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

        //해시태그 최대10
        List<String> tagName1 = hashtagDTO.getTagName();//해시태그 10개를 넣었다면 10개가 들어있다
        for (String tagName : tagName1){
            productService.productHashTagSave(productDTO.getProdNo(),tagName);
        }
        //해시태그 10개를 저장

        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++) {
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName, dbFileName, productDTO.getProdNo(), Integer.toString(i));
            //DB저장부분
        }

        return productDTO;
    }

    //수정버튼클릭시 이미 입력된 내용 보여주기


    //수정 (이미지, 제목, 가격, 가격제안, 무료나눔, 카테고리, 내용, 해시태그)
    @PostMapping("/{prodNo}/update")
    public void productUpdate(@PathVariable int prodNo, ProductDTO productDTO,CategoryDTO categoryDTO, FileForm fileForm, HashTagDTO hashTagDTO) throws IOException {

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

    //전체보기
    //@GetMapping("")

    //상세보기 (좋아요갯수, 판매자정보 ,제목, 가격, 내용,주소, 날짜, 조회수,이미지 )
    @GetMapping("/{prodNo}")
    public void productDetail(){

    }

    //무료나눔했을때 뭐해야할께 있나?
    //신고 버튼 눌렀을때
    //좋아요 버튼 눌렀을때
    //별점정보 입력할때 (구매자 들어가야됨)
    //가격 제시 했을때 높은금액으로 update
    //검색기능
    //게시글 정렬
    //구매자 선택 했을때 구현 update

}