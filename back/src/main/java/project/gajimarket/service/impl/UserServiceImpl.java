package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.gajimarket.dao.ProductDAO;
import project.gajimarket.dao.UserDAO;
import project.gajimarket.model.*;
import project.gajimarket.service.ProductService;
import project.gajimarket.service.UserService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserDAO userDao;

    @Override
    public int checkUserId(String id) {
        return userDao.checkUserId(id);
    }
    @Override
    public int insertUser(UserDTO userDto) {
        return userDao.insertUser(userDto);
    }

    @Override
    public UserDTO selectUser(Map<String, Object> param) {
        return userDao.selectUser(param);
    }

    @Override
    public List<Map<String, Object>> selectUserInterestProd(Map<String, Object> param){
        return userDao.selectUserInterestProd(param);
    }

    @Override
    public List<Map<String, Object>> selectUserSellProd(Map<String, Object> param) {
        return userDao.selectUserSellProd(param);
    }

    @Override
    public List<Map<String, Object>> selectUserBuyProd(Map<String, Object> param) {
        return userDao.selectUserBuyProd(param);
    }

    @Override
    public int updateUser(UserDTO userDto) {
        return userDao.updateUser(userDto);
    }

    @Override
    public int updateNtfct(UserDTO userDto) {
        return userDao.updateNtfct(userDto);
    }

    @Override
    public int updateOutUser(int userNo) {
        return userDao.updateOutUser(userNo);
    }
}