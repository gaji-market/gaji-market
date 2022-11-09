package project.gajimarket.model.file;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class FileForm {
    private int id;
    private List<MultipartFile> imageFiles;
}
