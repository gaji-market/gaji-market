package project.gajimarket.service;

import java.util.List;
import java.util.Map;

public interface NotifiService {
    int addNotification(Map<String, Object> map);

    Map<String, Object> getNotification();

    List<Map<String, Object>> getNotificationList();

    int updateNotification(Map<String, Object> map);
}
