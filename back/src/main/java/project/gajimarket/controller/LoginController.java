package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.*;
import project.gajimarket.service.FileService;
import project.gajimarket.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
@Slf4j
@Transactional
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    private final UserService userService;
    private final FileService fileService;

    // 회원가입
    @PostMapping("/signUp")
    public Map<String,Object> signUp(@RequestBody UserDTO userDto) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            int result = userService.insertUser(userDto);
            if (result > 0) {
                resultMap.put("result", "success");
            } else {
                resultMap.put("result", "false");
            }
        }catch (Exception e) {
            System.out.println("LoginController signUp : " + e);
        }
        return resultMap;
    }

    // 로그인
    @PostMapping("/signIn")
    public Map<String, Object> signIn(@RequestBody UserDTO userDto, HttpServletRequest request) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> param = new HashMap<>();

        try {
            if (userDto.getSocialKind() == 0) {

            } else if (userDto.getSocialKind() == 1) {

            } else {
                param.put("userId", userDto.getUserId());
                param.put("userPwd", userDto.getUserPwd());
            }

            UserDTO selectUser = userService.selectUser(param);
            if (selectUser != null) {
                request.getSession().setAttribute("userInfo", selectUser);
                resultMap.put("userInfo", selectUser);
            }

        }catch (Exception e) {
            System.out.println("LoginController signIn : " + e);
        }

        return resultMap;
    }

    // 마이페이지 이동
    @GetMapping("/myPage")
    public Map<String, Object> myPage(HttpServletRequest request) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        UserDTO userDto = (UserDTO) request.getSession().getAttribute("userInfo");
        try {
            if (userDto != null) {
                resultMap.put("result", "success");
                resultMap.put("userInfo", userDto);
            } else { 
                resultMap.put("result", "false");
            }
        }catch (Exception e) {
            System.out.println("LoginController mypage : " + e);
        }
        return resultMap;
    }

    // 내정보 수정
    @PostMapping("/userUpdate")
    public Map<String, Object> userUpdate(@RequestBody UserDTO userDto, HttpServletRequest request) throws IOException {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        UserDTO updateUser = null;
        try {
            result.put("result", "false");

            if (userDto != null) {
                int update = userService.updateUser(userDto);
                if (update > 0) {
                    result.put("result", "success");
                    param.put("userNo", userDto.getUserNo());
                }
            }

            // 수정성공시 session에 담음
            if (!"false".equals(result.get("result"))) {
                request.getSession().setAttribute("userInfo", userDto);
                result.put("userInfo", userService.selectUser(param));
            }

        }catch (Exception e) {
            System.out.println("LoginController userUpdate : " + e);
        }
        return result;
    }

    // 신고당할 경우
    @GetMapping("/reportUser")
    public boolean reportUser(@PathVariable int userNo, HttpServletRequest request) throws IOException {
        boolean result = true;
        try {
            Map<String, Object> param = new HashMap<>();
            param.put("userNo", userNo);

            UserDTO reportUser = userService.selectUser(param);	// 신고당하는 사람
            UserDTO user = (UserDTO) request.getSession().getAttribute("userInfo");	// 신고하는 사람

        } catch (Exception e) {
            System.out.println("LoginController reportUser : " + e);
        }
        return result;
    }
}