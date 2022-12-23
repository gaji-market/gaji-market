package project.gajimarket.service;

import java.util.List;
import java.util.Map;

public interface NotifiService {
    Map<String, Object> addNotification(Map<String, Object> map);

    Map<String, Object> getNotification();

    Map<String, Object> getNotificationList(Map<String, Object> map);

    Map<String, Object> updateNotification(Map<String, Object> map);

    int getNotificationCnt(Map<String, Object> map);

    Map<String, Object> getNotificationCheckCnt(int userNo);
}
