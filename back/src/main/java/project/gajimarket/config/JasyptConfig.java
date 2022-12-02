package project.gajimarket.config;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

/*
암호화 클래스
 */
@Configuration
@EnableEncryptableProperties
public class JasyptConfig {

    /*@Bean("jasyptEncryptor")
    public StringEncryptor stringEncryptor() {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        encryptor.setProvider(new BouncyCastleProvider());
        encryptor.setPoolSize(2); // 암호화 요청의 pool 크기. 2를 권장
        encryptor.setPassword(getJasyptEncryptorPassword()); // 암호화 키
        encryptor.setAlgorithm("PBEWithSHA256And128BitAES-CBC-BC"); // 사용 알고리즘

        return encryptor;
    }

    //리소스 파일을 읽는 메서드 (키 값 따로 저장)
    private String getJasyptEncryptorPassword() {
        try {
            ClassPathResource resource = new ClassPathResource("data/jasypt-encryptor-password.txt");
            return Files.readAllLines(Paths.get(resource.getURI())).stream()
                    .collect(Collectors.joining(""));
        } catch (IOException e) {
            throw new RuntimeException("Not found Jasypt password file.");
        }
    }*/
}


