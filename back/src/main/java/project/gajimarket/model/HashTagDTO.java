package project.gajimarket.model;

import lombok.Data;

import java.util.List;

@Data
public class HashTagDTO {
    private int prodNo;
    private List<String> tagName;
}
