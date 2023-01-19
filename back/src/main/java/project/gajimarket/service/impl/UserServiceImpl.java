package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.dao.FileDAO;
import project.gajimarket.dao.ProductDAO;
import project.gajimarket.dao.UserDAO;
import project.gajimarket.model.*;
import project.gajimarket.model.file.UploadFile;
import project.gajimarket.service.FileService;
import project.gajimarket.service.ProductService;
import project.gajimarket.service.UserService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserDAO userDao;

    private final FileService fileService;

    private final FileDAO fileDAO;

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
    public List<Map<String, Object>> selectUserInterestProdList(Map<String, Object> param){
        return userDao.selectUserInterestProd(param);
    }
    @Override
    public int selectUserInterestProdCnt(Map<String, Object> param) {
        return userDao.selectUserInterestProdCnt(param);
    }

    @Override
    public List<Map<String, Object>> selectUserSellProdList(Map<String, Object> param) {
        return userDao.selectUserSellProd(param);
    }
    @Override
    public int selectUserSellProdCnt(Map<String, Object> param) {
        return userDao.selectUserSellProdCnt(param);
    }

    @Override
    public List<Map<String, Object>> selectUserBuyProdList(Map<String, Object> param) {
        return userDao.selectUserBuyProd(param);
    }
    @Override
    public int selectUserBuyProdCnt(Map<String, Object> param) {
        return userDao.selectUserBuyProdCnt(param);
    }

    @Override
    public int updateUser(UserDTO userDto, MultipartFile imgFile) {
        Map<String, Object> paramMap = new HashMap<>();
        List<String> dbFileNames = new ArrayList<>();
        int result = -1;
        try {
            // 사용자 이미지 조회
            Map<String, Object> selectUserImg = fileDAO.selectUserImg(userDto);

            if (imgFile != null) {
                // 이전 이미지 삭제
                if (selectUserImg != null) {
                    dbFileNames.add((String)selectUserImg.get("dbFileName"));
                    fileService.fileDelete(dbFileNames);
                    fileDAO.deleteUserImg(userDto);
                }

                // 이미지 저장
                UploadFile uploadFile = fileService.storeFile(imgFile);
                paramMap.put("uploadFileName", uploadFile.getUploadFileName());
                paramMap.put("dbFileName", uploadFile.getDbFileName());
                paramMap.put("userNo", userDto.getUserNo());

                System.out.println("UserServiceImpl uploadFile : " + uploadFile);
                int fileSaveResult = fileDAO.userFileSave(paramMap);
                if (fileSaveResult > 0) {
                    result = userDao.updateUser(userDto);
                }
            }

        } catch (IOException e) {
            System.out.println("UserServiceImpl updateUser : " + e);
        }
        return result;
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