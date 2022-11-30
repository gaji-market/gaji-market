package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface NotifiDAO {
    int insertNotification(Map<String, Object> map);

    Map<String, Object> selectNotification();

    List<Map<String, Object>> selectNotificationList();

    int updateNotificationList(Map<String, Object> map);
}
