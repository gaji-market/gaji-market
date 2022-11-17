package project.gajimarket.model;

import lombok.Data;

@Data
public class ScoreInfoDTO {
    private int userNo;
    private int prodNo;
    private float score1;
    private String tag1;
    private float score2;
    private String tag2;
    private float score3;
    private String tag3;
    private String tradeReview;
}
