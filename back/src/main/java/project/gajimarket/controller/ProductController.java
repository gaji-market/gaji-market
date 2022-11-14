package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.file.FileDTO;
import project.gajimarket.model.file.FileForm;
import project.gajimarket.model.Hash_tagDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final FileService fileService;


    //팔래요 상품 등록 화면
    @GetMapping("/sell")
    public String sell(){
        return "ok";
    }

    //살래요 상품 등록 화면
    @GetMapping("/buy")
    public String buy(){
        return "ok";
    }

    //팔래요 상품 등록 처리
    @PostMapping("/sellSave")
    public ProductDTO sellSave(ProductDTO productDTO, Hash_tagDTO hash_tagDTO,@ModelAttribute FileForm fileForm) throws IOException {
        //상품 등록하는 유저의 주소 가져오기
        String findAddress = productService.findUserAddress(1);

        //입력한 상품 입력
        productDTO.setUserNo(1);
        productDTO.setCategoryNo(1); // 카테고리 저장
        productDTO.setProdName("팔래요 테스트 상품 이름");
        productDTO.setProdPrice(50000);
        productDTO.setPriceOffer("0");
        productDTO.setFreeCheck("0");
        productDTO.setProdExplain("팔래요 테스트 상품 설명입니다");
        productDTO.setRegDt(LocalDateTime.now());
        productDTO.setAddress(findAddress);

        //팔래요 상품 등록
        productService.productSellSave(productDTO);

        //해쉬태그 저장 반복문 써야하나?
        hash_tagDTO.setProdNo(productDTO.getProdNo());
        hash_tagDTO.setTagName("테스트테그");
        productService.productHashTagSave(hash_tagDTO);

        //파일저장
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++){
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName,dbFileName,productDTO.getProdNo(),Integer.toString(i));
            //DB저장부분
        }


        return productDTO;
    }

    //살래요 상품 등록 처리
    @PostMapping("/buySave")
    public ProductDTO buySave(ProductDTO productDTO){
        //상품 등록하는 유저의 주소 가져오기
        String findAddress = productService.findUserAddress(1);

        //입력한 상품 입력
        productDTO.setUserNo(1);
        productDTO.setCategoryNo(1);
        productDTO.setProdName("살래요 테스트 상품 이름");
        productDTO.setProdPrice(50000);
        productDTO.setPriceOffer("0");
        productDTO.setFreeCheck("1"); // 무료나눔 -> 1
        productDTO.setProdExplain("살래요 테스트 상품 설명입니다");
        productDTO.setRegDt(LocalDateTime.now());
        productDTO.setAddress(findAddress);

        //살래요 상품 등록
        productService.productBuySave(productDTO);

        return productDTO;
    }

    //팔래요, 살래요 삭제
    @PostMapping("/{prodNo}/delete")
    public void productDelete (@PathVariable int prodNo){
        productService.productDelete(prodNo);
    }

    //수정버튼클릭시 이미 입력된 내용 보여주기


    //수정 (이미지, 제목, 가격, 가격제안, 무료나눔, 카테고리, 내용, 해시태그)
    @PostMapping("/{prodNo}/update")
    public void productUpdate(@PathVariable int prodNo,ProductDTO productDTO,FileForm fileForm) throws IOException {

        productDTO.setCategoryNo(2);
        productDTO.setProdName("수정제목");
        productDTO.setProdPrice(1234);
        productDTO.setPriceOffer("1");
        productDTO.setFreeCheck("1");
        productDTO.setProdExplain("수정한 내용입니다");
        productDTO.setTradState("2");//거래중,거래완료 수정
        productService.productUpdate(prodNo,productDTO);
        //상태가 거래중, 거래완료 일때는 다른 글들은 수정불가능하다..

        //이미지 수정
        //이미지 삭제
        List<String> findDBFile = productService.productFindDBFile(prodNo); //저장된 파일이름 가져오기
        log.info("find={}",findDBFile);

        //파일저장
        /** List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImageFiles());
        for (int i=0; i<storeImageFiles.size(); i++){
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName,dbFileName,productDTO.getProdNo(),Integer.toString(i));
            //DB저장부분
        } */
        //이렇게되면 또 저장이된다.... 저장하기전에 삭제를 하고 다시저장을 하면? 파일 삭제(no를 가져와서 전체삭제..)
        //아니면 그냥 update?


        //카테고리 수정 -> 다른카테고리로 변경하면 외래키가 자동으로 바뀌어야한다 먼가 방법이 필요함
        //해시태그 수정


    }
    //전체보기
    //@GetMapping("")

    //상세보기 (좋아요갯수, 판매자정보 ,제목, 가격, 내용,주소, 날짜, 조회수,이미지 )
    @GetMapping("/{prodNo}")
    public void productDetail(){

    }

}