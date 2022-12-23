package project.gajimarket.controller;

import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.model.SearchPagination;
import project.gajimarket.service.NotifiService;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/notifi")
public class NotifiController {

    private final NotifiService notifiService;

    @Operation(summary = "알림 등록", description = "알림 등록 API")
    @PostMapping("/addNotifi/{userNo}")
    public Map<String, Object> addNotification(
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo,
            @RequestBody Map<String, Object> requestMap) {

        log.info("requestMap 확인 :: " + requestMap.toString());
        try {
            requestMap.put("senderUserNo", userNo); //user session
            return notifiService.addNotification(requestMap);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg();
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
            map.put("userNo", userNo);
            map.put("gubun", gubun);

            return notifiService.getNotificationList(map);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg();
        }
    }

    @Operation(summary = "보류")
    @GetMapping("/getNotifi")
    public Map<String, Object> getNotification(@RequestBody Map<String, Object> map) {
        return null;
    }

    @Operation(summary = "미확인 알림 개수 조회", description = "미확인 알림 개수 조회 API")
    @GetMapping("/getCheckCnt/{userNo}")
    public Map<String, Object> getNotificationCheckCnt(
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo) {
        log.info("userNo :: " + userNo);

        try {
            return notifiService.getNotificationCheckCnt(userNo);
        } catch (Exception e) {
            return CommonUtil.resultMsg();
        }
    }
}
