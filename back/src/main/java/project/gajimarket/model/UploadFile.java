package project.gajimarket.model;

import lombok.Data;

@Data
public class UploadFile {
    private String uploadFileName;
    private String dbFileName;

    public UploadFile(String uploadFileName, String dbFileName) {
        this.uploadFileName = uploadFileName;
        this.dbFileName = dbFileName;
    }
}
