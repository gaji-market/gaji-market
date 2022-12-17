package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.JWTUtils;
import project.gajimarket.model.*;
import project.gajimarket.service.FileService;
import project.gajimarket.service.UserService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
@Transactional
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final FileService fileService;

    // 아이디 중복확인
    @PostMapping("/checkUserId")
    public Map<String, Object> checkUserId(UserDTO userDto) throws Exception{
        Map<String, Object> resultMap = new HashMap<>();
        String result = "success";
        try {
            if (userDto.getUserId() != null && !"".equals(userDto.getUserId())) {
                System.out.println("userId : " + userDto.getUserId());
                int checkUserId = userService.checkUserId(userId);
                if (checkUserId > 0) {
                    result = "fail";
                }
            }
            resultMap.put("result", result);
        } catch (Exception e) {
            System.out.println("UserController checkUserId : " + e);
        }
        return resultMap;
    }

    // 회원가입
    @PostMapping("/signUp")
    public Map<String,Object> signUp(@RequestBody UserDTO userDto) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            System.out.println("signUp userDto : " + userDto);
            int result = userService.insertUser(userDto);
            if (result > 0) {
                resultMap.put("result", "success");
            } else {
                resultMap.put("result", "fail");
            }
        }catch (Exception e) {
            System.out.println("UserController signUp : " + e);
        }
        return resultMap;
    }

    // 로그인
    @PostMapping("/signIn")
    public Map<String, Object> signIn(@RequestBody UserDTO userDto, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        String result = "fail";
        String token = "";
        try {
            param.put("userId", userDto.getUserId());
            param.put("userPwd", userDto.getUserPwd());

            UserDTO selectUser = userService.selectUser(param);
            System.out.println("UserController signIn selectUser : " + selectUser);
            if (selectUser != null) {
                // 토큰 생성
                token = JWTUtils.createAccessToken(param);
                System.out.println("UserController signIn token : " + token);
                if (token != null && !"".equals(token)) {
                    result = "success";

                    Cookie cookie = new Cookie("X-AUTH-TOKEN", token);
                    response.addCookie(cookie);
                }
            }

            resultMap.put("result", result);
            resultMap.put("token", token);
        }catch (Exception e) {
            System.out.println("UserController signIn : " + e);
        }
        return resultMap;
    }

    // 마이페이지 이동
    @PostMapping("/myPage")
    public Map<String, Object> myPage(HttpServletRequest request) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> param = null;
        String result = "fail";

        try {
            String headerToken = JWTUtils.getHeaderToken(request);
            System.out.println("UserController myPage token : " + headerToken);

            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtils.getTokenInfo(headerToken);
                if (param != null) {
                    UserDTO selectUser = userService.selectUser(param);
                    System.out.println("UserController myPage userDto : " + selectUser);
                    if (selectUser != null) {
                        result = "success";
                        resultMap.put("userInfo", selectUser);
                    }
                }
            }
            resultMap.put("result", result);
        } catch (Exception e) {
            System.out.println("UserController myPage : " + e);
        }
        return resultMap;
    }

    // 내정보 수정
    @PostMapping("/userUpdate")
    public Map<String, Object> userUpdate(@RequestBody UserDTO userDto, HttpServletRequest request) throws IOException {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        try {
            result.put("result", "fail");

            // 받은 UserDTO
            System.out.println("UserDTO : " + userDto);
            if (userDto != null) {
                int update = userService.updateUser(userDto);
                if (update > 0) {
                    result.put("result", "success");
                    param.put("userNo", userDto.getUserNo());
                }
            }

            // 수정성공시 session에 담음
            if (!"fail".equals(result.get("result"))) {
                request.getSession().setAttribute("userInfo", userDto);
                result.put("userInfo", userService.selectUser(param));
            }
            // 세션에 있는 userDTO
            System.out.println("userUpdate session UserDto : " + (UserDTO)request.getSession().getAttribute("userInfo"));

        }catch (Exception e) {
            System.out.println("UserController userUpdate : " + e);
        }
        return result;
    }

    // 알림 수정
    @GetMapping("/updateNtfct/{gubun}/{useYn}")
    public Map<String, Object> updateNtfct(@PathVariable String gubun, @PathVariable String useYn, HttpServletRequest request) {
        Map<String, Object> param = new HashMap<>();
        Map<String, Object> resultMap = new HashMap<>();
        String result = "fail";
        try {
            UserDTO user = (UserDTO) request.getSession().getAttribute("userInfo");
            System.out.println("updateNtfct session userInfo : " + user);

            // gubun ( 0: 채팅, 1: 댓글, 2: 좋아요 )
            if (gubun != null && !"".equals(gubun)){
                if (useYn != null && "".equals(useYn)){
                    param.put("gubun", gubun);
                    param.put("useYn", useYn);
                }
            }
            if (user != null) {
                param.put("userNo", user.getUserNo());
            }

            // 수정하는 Map 확인
            System.out.println("updateNtfct param : " + param);
            int updateNtfctResult = userService.updateNtfct(param);
            if (updateNtfctResult > 0) {
                result = "success";
            }
            resultMap.put("result", result);
        } catch (Exception e) {
            System.out.println("UserController updateNtfct : " + e);
        }
        return resultMap;
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

    // 로그아웃

    // 탈퇴
    @PostMapping("/outUser")
    public Map<String, Object> outUser(HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        String result = "fail";
        try {
            UserDTO userDto = (UserDTO) request.getSession().getAttribute("userInfo");
            System.out.println("outUser session userInfo : " + userDto);

            if (userDto != null) {
                int updateOutUser = userService.updateOutUser(userDto.getUserNo());
                if (updateOutUser > 0) {
                    result = "success";
                    request.getSession().setAttribute("userInfo", null);
                }
            }
            resultMap.put("result", result);
        } catch (Exception e) {
            System.out.println("UserController outUser : " + e );
        }
        return resultMap;
    }
}
