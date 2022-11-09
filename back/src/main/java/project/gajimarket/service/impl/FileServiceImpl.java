package project.gajimarket.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.UploadFile;
import project.gajimarket.service.FileService;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    //이미지 저장될 경로
    @Value("${file}")
    private String fileDir;

    @Override
    public String getFullPath(String filename) {
        return fileDir + filename;
    }

    @Override
    public List<UploadFile> storeFiles(List<MultipartFile> multipartFiles) throws IOException {
        //들어온 파일을 담을 리스트 생성
        List<UploadFile> storeFileResult = new ArrayList<>();

        for (MultipartFile multipartFile : multipartFiles){
            if (!multipartFile.isEmpty()){
                //반복해서 파일을 하나씩 서버로 보냄
                UploadFile uploadFile = storeFile(multipartFile);
                //List에 추가
                storeFileResult.add(uploadFile);
            }
        }
        return storeFileResult;
    }

    @Override
    public UploadFile storeFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile.isEmpty()){
            return null;
        }
        log.info("들어온 파일 = {}" ,multipartFile);
        String originFilename = multipartFile.getOriginalFilename();
        //오리지널 파일 이름 가져오기
        log.info("getOrigin = {}",originFilename);

        //서버에 저장하는 파일명
        String DBFileName = createDBFileName(originFilename);

        //지정한 경로로 서버에 저장할 파일명을 보냄
        multipartFile.transferTo(new File(getFullPath(DBFileName)));

        return new UploadFile(originFilename,DBFileName);
    }

    @Override
    public String createDBFileName(String originFilename) {

        //마지막 . 뒤에오는 확장자명 뽑기 ex=(png)
        int pos = originFilename.lastIndexOf(".");
        log.info("pos = {}",pos);

        String ext = originFilename.substring(pos + 1);
        log.info("ext = {}",ext);

        //서버에 저장하는 파일명
        String uuid = UUID.randomUUID().toString();

        String DBFileName = uuid + "." + ext;
        return DBFileName;
    }
}
