package project.gajimarket.controller;

import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.model.SearchPagination;
import project.gajimarket.model.UserDTO;
import project.gajimarket.service.NotifiService;
import project.gajimarket.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/notifi")
public class NotifiController {

    private final NotifiService notifiService;

    private final UserService userService;

    @Operation(summary = "알림 등록", description = "알림 등록 API")
    @PostMapping("/addNotifi/{userNo}")
    public Map<String, Object> addNotification(
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo,
            @RequestBody Map<String, Object> requestMap) {

        log.info("requestMap 확인 :: " + requestMap.toString());
        try {
            requestMap.put("senderUserNo", userNo); //user session

            //1. user session에 알림 설정 여부 데이터 있는지 확인
            //if (gubun값에 해당하는 설정 값 off일 시)
            //result값 -99 => 성공했지만 설정값으로 인해 insert 실행 안함

            //2. user session에 알림 설정 여부 데이터 없으면 쿼리로 설정값 가져오기
            UserDTO userDTO = userService.selectUser(requestMap);
            int gubun = Integer.parseInt(String.valueOf(requestMap.get("gubun")));
            if ((gubun == 1 && userDTO.getChatNtfct() == 'N') || (gubun == 2 && userDTO.getInterstNtfct() == 'N')) {
                return CommonUtil.resultMsg(-99);
            }

            return notifiService.addNotification(requestMap);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "알림 리스트", description = "알림 리스트 API")
    @PostMapping("/getNotifiList/{gubun}/{userNo}")
    public Map<String, Object> getNotificationList(
            @ApiParam(value = "유저번호", defaultValue = "1", example = "1") @PathVariable int userNo,
            @ApiParam(value = "구분번호(1=채팅, 2=좋아요)", defaultValue = "1", example = "1") @PathVariable int gubun,
            @RequestBody SearchPagination searchPagination) {
        log.info("SearchPagination :: " + searchPagination.toString());

        try {
            Map<String, Object> map = new HashMap<>();
            map.put("schPage", searchPagination);
            map.put("userNo", userNo); //session
            map.put("gubun", gubun);

            return notifiService.getNotificationList(map);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "알림 조회")
    @GetMapping("/getNotifi/{notifiNo}")
    public Map<String, Object> getNotification(@PathVariable int notifiNo) {
        try {
            return notifiService.getNotification(notifiNo);
        } catch (Exception e) {
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "알림 확인")
    @GetMapping("/checkNotifi/{notifiNo}")
    public Map<String, Object> checkNotification(@PathVariable int notifiNo) {
        try {
            return notifiService.updateNotification(notifiNo);
        } catch (Exception e) {
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "미확인 알림 개수 조회", description = "미확인 알림 개수 조회 API")
    @GetMapping("/getCheckCnt/{userNo}")
    public Map<String, Object> getNotificationCheckCnt(
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo) {

        log.info("userNo :: " + userNo);
        try {
            return notifiService.getNotificationCheckCnt(userNo); //session 값
        } catch (Exception e) {
            return CommonUtil.resultMsg(e.toString());
        }
    }
}
