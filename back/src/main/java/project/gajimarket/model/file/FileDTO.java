package project.gajimarket.model.file;

import lombok.Data;

@Data
public class FileDTO {
    private int no;
    private String gubun;
    private String fileOrder;
    private String uploadFileName;
    private String dbFileName;
}
