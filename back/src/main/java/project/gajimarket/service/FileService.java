package project.gajimarket.service;

import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.UploadFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    //이미지 저장될 경로
    String getFullPath(String filename);

    //여러개 파일저장
    List<UploadFile> storeFiles(List<MultipartFile> multipartFiles) throws IOException;

    //한개 파일 저장
    UploadFile storeFile(MultipartFile multipartFile) throws IOException;

    //DB에 저장할 파일 이름 생성(UUID)
    String createDBFileName(String originFilename);
}
