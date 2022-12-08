package project.gajimarket.model;

import lombok.Data;

@Data
public class CategoryDTO {
    private int categoryNo; //카테고리 번호
    private int largeCateNo; // 대분류 번호
    private String largeCateName; // 대분류 이름
    private int mediumCateNo; // 중분류 번호
    private String mediumCateName; // 중분류 이름
    private int smallCateNo; // 소분류 번호
    private String smallCateName; // 소분류 이름
}
