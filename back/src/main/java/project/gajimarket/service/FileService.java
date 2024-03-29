package project.gajimarket.service;

import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.file.UploadFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface FileService {

    //여러개 파일저장
    List<UploadFile> storeFiles(List<MultipartFile> multipartFiles) throws IOException;

    //한개 파일 저장
    UploadFile storeFile(MultipartFile multipartFile) throws IOException;

    //DB에 저장할 파일 이름 생성(UUID)
    String createDBFileName(String originFilename);

    //업로드한 이미지 파일 삭제
    void fileDelete(List<String> findFileDB) throws IOException;

    //aws에서 이미지 파일 가져오기
}
