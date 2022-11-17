package project.gajimarket.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.file.UploadFile;
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
                //반복해서 지정한 경로로 파일을 저장
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

        //오리지널 파일 이름 가져오기
        String originFilename = multipartFile.getOriginalFilename();

        //서버에 저장하는 파일명을 가져옴
        String DBFileName = createDBFileName(originFilename);

        //지정한 경로로 DB파일명으로 저장
        multipartFile.transferTo(new File(getFullPath(DBFileName)));

        return new UploadFile(originFilename,DBFileName);
    }

    @Override
    public String createDBFileName(String originFilename) {

        //마지막 점은 몇번째 있는지 ex : (pos = 34)
        int pos = originFilename.lastIndexOf(".");

        //ex : (ext = png)
        String ext = originFilename.substring(pos + 1);

        //랜덤 uuid 생성
        String uuid = UUID.randomUUID().toString();

        //DB에 저장하는 파일이름
        String DBFileName = uuid + "." + ext;
        return DBFileName;
    }

    @Override
    public void fileDelete(List<String> findFileDB) {
        for(String findFile : findFileDB){
            if (!findFile.isEmpty()) {
                File file = new File(getFullPath(findFile));
                file.delete();
            }
        }
    }
}