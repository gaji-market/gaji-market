package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface NotifiDAO {
    int insertNotification(Map<String, Object> map);

    Map<String, Object> selectNotification(Map<String, Object> map);

    List<Map<String, Object>> selectNotificationList(Map<String, Object> map);

    int updateNotificationList(Map<String, Object> map);

    int selectNotificationListCnt(Map<String, Object> map);

    Map<String, Object> selectNotificationCheckCnt(int userNo);
}
