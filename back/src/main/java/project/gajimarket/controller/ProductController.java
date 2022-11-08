package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.service.ProductService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


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
    public ProductDTO sellSave(ProductDTO productDTO){
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
    //전체보기
    //상세보기

}