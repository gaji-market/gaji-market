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
    public int updateUser(UserDTO userDto) {
        return userDao.updateUser(userDto);
    }

    @Override
    public int updateNtfct(Map<String, Object> param) {
        return userDao.updateNtfct(param);
    }
}