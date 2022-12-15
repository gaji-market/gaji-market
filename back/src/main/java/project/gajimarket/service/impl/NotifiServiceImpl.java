package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.Utils;
import project.gajimarket.dao.NotifiDAO;
import project.gajimarket.service.NotifiService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Service
public class NotifiServiceImpl implements NotifiService {

    private final NotifiDAO notifiDAO;

    @Override
    public Map<String, Object> addNotification(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();

        int result = notifiDAO.insertNotification(map);
        resultMap.put("result", Utils.resultMsg(result));

        return resultMap;
    }

    @Override
    public Map<String, Object> getNotification() {
        return null;
    }

    @Override
    public List<Map<String, Object>> getNotificationList(Map<String, Object> map) {
        return notifiDAO.selectNotificationList(map);
    }

    @Override
    public Map<String, Object> updateNotification(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();

        int result = notifiDAO.updateNotificationList(map);
        resultMap.put("result", Utils.resultMsg(result));

        return resultMap;
    }

    @Override
    public int getNotificationCnt(Map<String, Object> map) {
        return notifiDAO.selectNotificationCnt(map);
    }

    @Override
    public Map<String, Object> getNotificationCheckCnt(Map<String, Object> map) {
        return notifiDAO.selectNotificationCheckCnt(map);
    }
}
