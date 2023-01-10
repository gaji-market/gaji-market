package project.gajimarket.service;

import java.util.List;
import java.util.Map;

public interface NotifiService {
    Map<String, Object> addNotification(Map<String, Object> map);

    Map<String, Object> getNotification(int notifiNo);

    Map<String, Object> getNotificationList(Map<String, Object> map);

    Map<String, Object> updateNotification(int notifiNo);

    Map<String, Object> getNotificationCheckCnt(int userNo);
}
