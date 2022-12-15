package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface HashTagDAO {

    //DB 해시태그 삭제
    void productHashTagDelete(int prodNo);

    //해시태그 정보 가져오기
    List<Map<String, Object>> findHashTag(int prodNo);

    //해시태그 저장
    void productHashTagSave(int prodNo,String hashTag);

}
