package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import project.gajimarket.model.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserDAO {

    // 아이디 중복확인
    public int checkUserId(String id);

    // 회원가입
    public int insertUser(UserDTO userDto);

    // 유저찾기
    public UserDTO selectUser(Map<String, Object> param);

    // 좋아요한 상품
    public List<Map<String, Object>> selectUserInterestProd(Map<String, Object> param);

    // 판매내역
    public List<Map<String, Object>> selectUserSellProd(Map<String, Object> param);

    // 구매내역
    public List<Map<String, Object>> selectUserBuyProd(Map<String, Object> param);

    // 정보수정
    public int updateUser(UserDTO userDto);

    // 알림 수정
    public int updateNtfct (UserDTO userDto);

    // 회원탈퇴
    public int updateOutUser (int userNo);
}