package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.Utils.JWTUtil;
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
@CrossOrigin(origins = {"http://localhost:3000","http://gajimarket.shop.s3-website.ap-northeast-2.amazonaws.com/"})
public class UserController {

    private final UserService userService;
    private final FileService fileService;

    // 아이디 중복확인
    @PostMapping("/checkUserId")
    public Map<String, Object> checkUserId(@RequestBody UserDTO userDto) throws Exception{
        Map<String, Object> resultMap = new HashMap<>();
        String result = "fail";
        try {
            System.out.println("userId : " + userDto.getUserId());
            if (userDto.getUserId() != null && !"".equals(userDto.getUserId())) {
                int checkUserId = userService.checkUserId(userDto.getUserId());
                if (checkUserId <= 0) {
                    result = "success";
                } else {
                    result = "used";
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
                param.put("userNo", selectUser.getUserNo());
                param.put("userNickName", selectUser.getUserNickName());
                param.remove("userId");
                param.remove("userPwd");
                token = JWTUtil.createAccessToken(param);
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

    // 아이디/패스워드 찾기
    @PostMapping("/searchIdPwd")
    public Map<String, Object> searchIdPwd(@RequestBody UserDTO userDto) throws IOException {

        try {
            return userService.selectUserIdPwd(userDto);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    // 비밀번호 변경
    @PostMapping("/updatePwd")
    public Map<String, Object> updatePwd(@RequestBody UserDTO userDto) throws IOException {
        try {
            return userService.updatePwd(userDto);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    // 마이페이지 이동
    @PostMapping("/myPage")
    public Map<String, Object> myPage(HttpServletRequest request) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> param = null;

        SearchPagination schPage = new SearchPagination();
        schPage.setLimitPage(0);
        schPage.setRecordCount(4);

        String result = "fail";

        try {
            String headerToken = JWTUtil.getHeaderToken(request);
            System.out.println("UserController myPage token : " + headerToken);

            // 토큰 복호화
            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtil.getTokenInfo(headerToken);
                UserDTO selectUser = userService.selectUser(param);
                System.out.println("UserController myPage userDto : " + selectUser);
                if (selectUser != null) {
                    result = "success";
                    resultMap.put("userInfo", selectUser);
                }
            }

            if (param != null) {
                param.put("schPage", schPage);
                System.out.println(param);
                // 좋아요 상품
                List<Map<String, Object>> interestProdList = userService.selectUserInterestProdList(param);
                System.out.println("UserController myPage interestProdList : " + interestProdList);
                if (interestProdList != null) {
                    resultMap.put("interestProdList", interestProdList);
                    resultMap.put("interestProdListCnt", userService.selectUserInterestProdCnt(param));
                }

                // 판매
                List<Map<String, Object>> sellProdList = userService.selectUserSellProdList(param);
                System.out.println("UserController myPage sellProdList : " + sellProdList);
                if (sellProdList != null) {
                    resultMap.put("sellProdList", sellProdList);
                    resultMap.put("sellProdListCnt", userService.selectUserSellProdCnt(param));
                }

                // 구매
                List<Map<String, Object>> buyProdList = userService.selectUserBuyProdList(param);
                System.out.println("UserController myPage buyProdList : " + buyProdList);
                if (buyProdList != null) {
                    resultMap.put("buyProdList", buyProdList);
                    resultMap.put("buyProdListCnt", userService.selectUserBuyProdCnt(param));
                }
            }

            resultMap.put("result", result);
        } catch (Exception e) {
            System.out.println("UserController myPage : " + e);
        }
        return resultMap;
    }

    // 좋아요 상품
    @PostMapping(value = "/interestProdList")
    public Map<String, Object> interestProdList(@RequestBody SearchPagination searchPagination, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        System.out.println(searchPagination);
        try {
            String headerToken = JWTUtil.getHeaderToken(request);
            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtil.getTokenInfo(headerToken);
                if (param != null) {
                    searchPagination.setTotalRecordCount(userService.selectUserInterestProdCnt(param));
                    param.put("schPage", searchPagination);
                    List<Map<String, Object>> interestProdList = userService.selectUserInterestProdList(param);
                    result.put("shcPage", searchPagination);
                    result.put("interestProdList", interestProdList);
                }
            }
        } catch (Exception e){
            System.out.println("UserController interestProdList : " + e);
        }

        return result;
    }

    // 판매 상품
    @PostMapping(value="/sellProdList")
    public Map<String, Object> sellProdList(@RequestBody SearchPagination searchPagination, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        System.out.println(searchPagination);
        try {
            String headerToken = JWTUtil.getHeaderToken(request);
            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtil.getTokenInfo(headerToken);
                if (param != null) {
                    searchPagination.setTotalRecordCount(userService.selectUserSellProdCnt(param));
                    param.put("schPage", searchPagination);
                    List<Map<String, Object>> sellProdList = userService.selectUserSellProdList(param);
                    result.put("shcPage", searchPagination);
                    result.put("sellProdList", sellProdList);
                }
            }
        } catch (Exception e){
            System.out.println("UserController sellProdList : " + e);
        }

        return result;
    }

    // 구매 상품
    @PostMapping(value="/buyProdList")
    public Map<String, Object> buyProdList(@RequestBody SearchPagination searchPagination, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        System.out.println(searchPagination);
        try {
            String headerToken = JWTUtil.getHeaderToken(request);
            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtil.getTokenInfo(headerToken);
                if (param != null) {
                    searchPagination.setTotalRecordCount(userService.selectUserBuyProdCnt(param));
                    param.put("schPage", searchPagination);
                    List<Map<String, Object>> buyProdList = userService.selectUserBuyProdList(param);
                    result.put("shcPage", searchPagination);
                    result.put("buyProdList", buyProdList);
                }
            }
        } catch (Exception e){
            System.out.println("UserController sellProdList : " + e);
        }

        return result;
    }

    // 내정보 수정
    @PostMapping(value = "/userUpdate", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public Map<String, Object> userUpdate(@RequestPart(value = "dto") UserDTO userDto, @RequestPart(value = "multipartFile", required = false) MultipartFile multipartFile, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        String token = "";
        String result = "fail";
        try {
            // 토큰 가져옴
            String headerToken = JWTUtil.getHeaderToken(request);
            System.out.println("UserController userUpdate request token : " + headerToken);

            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtil.getTokenInfo(headerToken);
                if (param.get("userNo") != null && !"".equals(param.get("userNo"))) {
                    userDto.setUserNo((Integer)param.get("userNo"));
                    System.out.println("UserController userUpdate userDto : " + userDto);

                    int update = userService.updateUser(userDto, multipartFile);
                    if(update > 0) {
                        // 토큰 생성
                        token = JWTUtil.createAccessToken(param);
                        System.out.println("UserController userUpdate token : " + token);
                        if (token != null && !"".equals(token)) {
                            result = "success";

                            Cookie cookie = new Cookie("X-AUTH-TOKEN", token);
                            response.addCookie(cookie);
                        }
                    }
                }
            }
            resultMap.put("result", result);
            resultMap.put("token", token);
        }catch (Exception e) {
            System.out.println("UserController userUpdate : " + e);
        }
        return resultMap;
    }

    // 알림 수정
    @PostMapping("/updateNtfct")
    public Map<String, Object> updateNtfct(@RequestBody UserDTO userDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> param = new HashMap<>();
        int updateResult = 0;
        String result = "fail";
        try {
            // 토큰 가져옴
            String headerToken = JWTUtil.getHeaderToken(request);
            System.out.println("UserController updateNtfct token : " + headerToken);

            if (headerToken != null && !"".equals(headerToken)) {
                param = JWTUtil.getTokenInfo(headerToken);
                System.out.println("updateNtfct token : " + param);
                if (param != null) {
                    if (param.get("userNo") != null && !"".equals(param.get("userNo"))) {
                        userDto.setUserNo((Integer) param.get("userNo"));
                        updateResult = userService.updateNtfct(userDto);
                        if (updateResult > 0) {
                            result = "success";
                        }
                    }
                }
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
