package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.ScoreDTO;

@Mapper
public interface ScoreDAO {

    //별점 정보 저장
    void productScoreSave(ScoreDTO scoreDTO);
}
