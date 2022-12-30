package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.dao.NotifiDAO;
import project.gajimarket.model.SearchPagination;
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
        int result = notifiDAO.insertNotification(map);

        return CommonUtil.resultMsg(result);
    }

    @Override
    public Map<String, Object> getNotification() {
        return null;
    }

    @Override
    public Map<String, Object> getNotificationList(Map<String, Object> map) {
        List<Map<String, Object>> notifiList = notifiDAO.selectNotificationList(map);

        SearchPagination searchPagination = (SearchPagination) map.get("schPage");
        searchPagination.setTotalRecordCount(notifiDAO.selectNotificationListCnt(map));

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("schPage", searchPagination);
        resultMap.put("notificationInfos", notifiList);

        return resultMap;
    }

    @Override
    public Map<String, Object> updateNotification(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();

        int result = notifiDAO.updateNotificationList(map);
        resultMap.put("result", CommonUtil.resultMsg(result));

        return resultMap;
    }

    @Override
    public int getNotificationCnt(Map<String, Object> map) {
        return notifiDAO.selectNotificationListCnt(map);
    }

    @Override
    public Map<String, Object> getNotificationCheckCnt(int userNo) {
        return notifiDAO.selectNotificationCheckCnt(userNo);
    }
}
