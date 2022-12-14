package project.gajimarket.model;

import lombok.Data;

@Data
public class InterestDTO {
    private int interestNo; //좋아요 번호
    private int prodNo; // 상품 번호
    private int userNo; // 좋아요 누른 사람 번호
}
