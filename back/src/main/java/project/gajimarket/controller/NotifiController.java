package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.service.NotifiService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/notifi")
public class NotifiController {

    private final NotifiService notifiService;

    @PostMapping("/addNotifi")
    public Map<String, Object> addNotification(@RequestBody Map<String, Object> requestMap) {

        log.info("requestMap 확인 :: " + requestMap.toString());
        requestMap.put("senderUserNo", 3); //user session

        return notifiService.addNotification(requestMap);
    }

    @GetMapping("/getNotifiList")
    public List<Map<String, Object>> getNotificationList(@RequestBody Map<String, Object> requestMap) {

        return notifiService.getNotificationList(requestMap);
    }

    @GetMapping("/getNotifi")
    public Map<String, Object> getNotification(@RequestBody Map<String, Object> map) {
        return null;
    }

    @GetMapping("/getCheckCnt")
    public Map<String, Object> getNotificationCheckCnt(@RequestBody Map<String, Object> map) {
        return notifiService.getNotificationCheckCnt(map);
    }
}
