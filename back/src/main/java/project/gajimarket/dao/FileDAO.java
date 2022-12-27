package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.UserDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface FileDAO {

    //DB에 저장된 이미지 파일이름 가져오기
    List<Map<String, Object>> findFileInfo(int prodNo);

    //파일 업로드
    void productFileSave(String uploadFileName,String DBFilename,int prodNo,String i);

    //상품 번호로 업로드한 파일 찾기
    List<String> productFindDBFile(int prodNo);

    //DB file 테이블 정보 삭제
    void productFileDelete(int prodNo);

    // 사용자 이미지 저장
    int userFileSave(Map<String, Object> param);

    // 사용자 이미지 조회
    Map<String, Object> selectUserImg(UserDTO userDto);

    // 사용자 이미지 삭제
    int deleteUserImg(UserDTO userDto);
}
