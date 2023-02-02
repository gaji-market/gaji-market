package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.dao.NotifiDAO;
import project.gajimarket.model.SearchPagination;
import project.gajimarket.model.UserDTO;
import project.gajimarket.service.NotifiService;
import project.gajimarket.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Service
public class NotifiServiceImpl implements NotifiService {

    private final NotifiDAO notifiDAO;
    private final UserService userService;

    @Override
    public Map<String, Object> addNotification(Map<String, Object> map) {
        UserDTO userDTO = userService.selectUser(map);

        int gubun = Integer.parseInt(String.valueOf(map.get("gubun")));
        if ((gubun == 1 && userDTO.getChatNtfct() == 'N') || (gubun == 2 && userDTO.getInterstNtfct() == 'N')) {
            return CommonUtil.resultMsg(0);
        }

        if (gubun == 1) {
            map.put("message", map.get("userNickName") + "님이 회원님과 채팅을 시작하였습니다.");
        } else {
            map.put("message", map.get("userNickName") + "님이 회원님의 상품에 좋아요를 눌렀습니다.");
        }

        int result = notifiDAO.insertNotification(map);
        return CommonUtil.resultMsg(result);
    }

    @Override
    public Map<String, Object> getNotification(int notifiNo) {
        return notifiDAO.selectNotification(notifiNo);
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
    public Map<String, Object> updateNotification(int notifiNo) {
        int result = notifiDAO.updateNotification(notifiNo);

        return CommonUtil.resultMsg(result);
    }

    @Override
    public Map<String, Object> getNotificationCheckCnt(int userNo) {
        return notifiDAO.selectNotificationCheckCnt(userNo);
    }
}
