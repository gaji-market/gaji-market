package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.FileForm;
import project.gajimarket.model.Hash_tagDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.UploadFile;
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
    public ProductDTO sellSave(ProductDTO productDTO, Hash_tagDTO hash_tagDTO, FileForm fileForm) throws IOException {
        //상품 등록하는 유저의 주소 가져오기
        String findAddress = productService.findUserAddress(1);

        //입력한 상품 입력
        productDTO.setUserNo(1);
        productDTO.setCategoryNo(1);
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
        log.info("asd = {}",fileForm);
        List<UploadFile> storeImageFiles = fileService.storeFiles(fileForm.getImagesFiles());
        log.info("컨트롤러에서 들어온 파일 이름 = {}",storeImageFiles);
        for (int i=0; i<storeImageFiles.size(); i++){
            String uploadFileName = storeImageFiles.get(i).getUploadFileName();
            String dbFileName = storeImageFiles.get(i).getDbFileName();
            productService.productFileSave(uploadFileName,dbFileName);
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

    //수정
    @PostMapping("/{prodNo}/update")
    public void productUpdate(@PathVariable int prodNo){

    }
    //전체보기
    //@GetMapping("")

    //상세보기
    @GetMapping("/{prodNo}")
    public void productDetail(){

    }

}