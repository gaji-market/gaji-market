package project.gajimarket.service;

import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.*;

import java.util.List;
import java.util.Map;

public interface UserService {

    public int checkUserId(String id);

    public int insertUser(UserDTO userDto);

    public UserDTO selectUser(Map<String, Object> param);

    public Map<String, Object> selectUserIdPwd(UserDTO userDTO);

    public Map<String, Object> updatePwd(UserDTO userDTO);

    public List<Map<String, Object>> selectUserInterestProdList(Map<String, Object> param);
    public int selectUserInterestProdCnt(Map<String, Object> param);

    public List<Map<String, Object>> selectUserSellProdList(Map<String, Object> param);
    public int selectUserSellProdCnt(Map<String, Object> param);

    public List<Map<String, Object>> selectUserBuyProdList(Map<String, Object> param);
    public int selectUserBuyProdCnt(Map<String, Object> param);

    public int updateUser(UserDTO userDto, MultipartFile imgFile);

    public int updateNtfct(UserDTO userDto);

    public int updateOutUser(int userNo);
}