package project.gajimarket.model;

import lombok.Data;

import java.util.List;

@Data
public class HashTagDTO {
    private int prodNo; // 해시태그 번호
    private List<String> tagName; // 태그 이름
}
