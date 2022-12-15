package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.InterestDTO;

@Mapper
public interface InterestDAO {

    //좋아요 갯수 가져오기
    int findInterestCnt(int prodNo);

    //좋아요 저장
    void interestSave(InterestDTO interestInfoDTO);

    //좋아요 삭제
    void interestDelete(int prodNo, int userNo);

    //좋아요 찾기
    Integer findInterest(int prodNo, int loginUserNo);
}
