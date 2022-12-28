package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CategoryDAO {

    //전체 카테고리 정보
    List<Map<String, Object>> categoryInfo();

    //카테고리 정보 가져오기
    Map<String, Object> findCategoryInfo(String cateCode);
}
