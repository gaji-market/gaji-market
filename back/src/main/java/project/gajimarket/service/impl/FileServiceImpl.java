package project.gajimarket.service.impl;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
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
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

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

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(multipartFile.getContentType());
        objectMetadata.setContentLength(multipartFile.getSize());

        try (InputStream inputStream = multipartFile.getInputStream()) {
            amazonS3Client.putObject(new PutObjectRequest(bucket, multipartFile.getOriginalFilename(), inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        }

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
                amazonS3Client.deleteObject(bucket,findFile);
            }
        }
    }
}
