package project.gajimarket.model;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class Param {

    private String prodName;
    private int prodPrice;
    private String prodExplain;
    private String priceOffer;
    private String freeCheck;
    private int largeCateNo;
    private int mediumCateNo;
    private int smallCateNo;
    private List<String> tagName;
}
