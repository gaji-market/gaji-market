package project.gajimarket.service;

import project.gajimarket.model.*;

import java.util.List;
import java.util.Map;

public interface UserService {

    public int checkUserId(String id);

    public int insertUser(UserDTO userDto);

    public UserDTO selectUser(Map<String, Object> param);

    public int updateUser(UserDTO userDto);

    public int updateNtfct(Map<String, Object> param);

    public int updateOutUser(int userNo);
}