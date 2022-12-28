package project.gajimarket.model;

import lombok.Data;

@Data
public class CategoryDTO {
    private int tier; //대중소 분류 1-대 2-중 3-소
    private String cateName; // 카테고리 이름
    private String cateCode; // 카테고리 코드
    private String cateParent; // 부모값
}
