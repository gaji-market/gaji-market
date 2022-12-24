package project.gajimarket.service;

import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.model.*;

import java.util.List;
import java.util.Map;

public interface UserService {

    public int checkUserId(String id);

    public int insertUser(UserDTO userDto);

    public UserDTO selectUser(Map<String, Object> param);

    public List<Map<String, Object>> selectUserInterestProd(Map<String, Object> param);

    public List<Map<String, Object>> selectUserSellProd(Map<String, Object> param);

    public List<Map<String, Object>> selectUserBuyProd(Map<String, Object> param);

    public int updateUser(UserDTO userDto, MultipartFile imgFile);

    public int updateNtfct(UserDTO userDto);

    public int updateOutUser(int userNo);
}