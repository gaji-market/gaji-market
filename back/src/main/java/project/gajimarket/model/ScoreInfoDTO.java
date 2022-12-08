package project.gajimarket.model;

import lombok.Data;

@Data
public class ScoreInfoDTO {
    private int userNo; // 판매자 유저 번호
    private int prodNo; // 상품 번호
    private float score1; // 점수
    private String tag1; // 태그(ex-약속을 잘지켜요)
    private float score2; // 점수
    private String tag2; // 태그(ex-친절해요)
    private float score3; // 점수
    private String tag3; // 태그(ex-물건이 좋아요)
    private String tradeReview; //거래후기
}
