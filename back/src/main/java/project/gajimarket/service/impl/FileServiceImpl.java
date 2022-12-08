package project.gajimarket.service.impl;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    String projectId = "gajimarket-123";
    String bucketName = "gaji-market-storage";
    String keyFileName = "gajimarket-123-cb4059fbbfd5.json";

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

        //키값 설정
        InputStream keyFile = ResourceUtils.getURL("classpath:" + keyFileName).openStream();
        Storage.BlobTargetOption precondition = Storage.BlobTargetOption.doesNotExist();

        //권한 설정
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId)
                .setCredentials(GoogleCredentials.fromStream(keyFile))
                .build().getService();

        //버킷이름 설정, storage에 저장할 이름 설정
        BlobId blobId = BlobId.of(bucketName, DBFileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        storage.create(blobInfo, multipartFile.getBytes(),precondition);

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
    public void fileDelete(List<String> findFileDB) throws IOException {

        //키값 설정
        InputStream keyFile = ResourceUtils.getURL("classpath:" + keyFileName).openStream();

        //권한 설정
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId)
                .setCredentials(GoogleCredentials.fromStream(keyFile))
                .build().getService();

        for (String findFile : findFileDB) {
            Blob blob = storage.get(bucketName, findFile);
            if (blob == null) {
                System.out.println("The object " + findFile + " wasn't found in " + bucketName);
                return;
            }
            Storage.BlobSourceOption precondition = Storage.BlobSourceOption.generationMatch(blob.getGeneration());
            storage.delete(bucketName, findFile, precondition);

            System.out.println("Object " + findFile + " was deleted from " + bucketName);
        }
    }
}
