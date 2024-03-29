package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.dao.ChatDAO;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.SearchPagination;
import project.gajimarket.service.ChatService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service("chatService")
public class ChatServiceImpl implements ChatService {

    private final ChatDAO chatDAO;
    //private Map<String, ChatRoom> chatRooms;

    public Map<String, Object> addChatRoom(ChatRoomDTO chatRoomDTO) {
        int result = 0;
        if (chatRoomDTO.getUserNo() > 0 && chatRoomDTO.getProdNo() > 0 && chatRoomDTO.getTgUserNo() > 0) {
            result = chatDAO.insertChatRoom(chatRoomDTO);
        }

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", CommonUtil.resultMsg(result));
        resultMap.put("chatRoomInfo", chatRoomDTO);

        return resultMap;
    }

    @Override
    public Map<String, Object> addChatMessage(Map<String, Object> map) {

        int result = chatDAO.insertChatMessage(map);

        return CommonUtil.resultMsg(result);
    }

    public Map<String, Object> getChatRoomList(Map<String, Object> map) {
        List<Map<String, Object>> chatRoomList = chatDAO.selectChatRoomList(map);

        SearchPagination searchPagination = (SearchPagination) map.get("schPage");
        searchPagination.setTotalRecordCount(chatDAO.selectChatRoomListCnt(map));

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("schPage", searchPagination);
        resultMap.put("chatRoomInfos", chatRoomList);

        return resultMap;
    }

    public Map<String, Object> getChatRoom(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();

        ChatRoomDTO chatRoom = chatDAO.selectChatRoom(map);
        resultMap.put("chatRoomInfo", chatRoom);
        List<Map<String, Object>> chatMsgList = chatDAO.selectChatMessage(map);
        resultMap.put("chatMessageInfos", chatMsgList);

        if (chatRoom != null) {
            Map<String, Object> userProfile = new HashMap<>();
            int userNo = (int) map.get("userNo");
            userProfile.put("myInfo", chatDAO.selectUserInfo(userNo));

            if (chatRoom.getUserNo() != userNo) { //현재 로그인된 유저랑 같지 않다면
                userProfile.put("otherInfo", chatDAO.selectUserInfo(chatRoom.getUserNo()));
            } else {
                userProfile.put("otherInfo", chatDAO.selectUserInfo(chatRoom.getTgUserNo()));
            }

            resultMap.put("userProfiles", userProfile);
        }

        if (chatMsgList != null && !chatMsgList.isEmpty()) {
            chatDAO.updateChatMessageCheck(map);
        }

        return resultMap;
    }

    @Override
    public Map<String, Object> removeChatRoom(int chatNo) {
        int result = chatDAO.deleteChatRoom(chatNo);

        return CommonUtil.resultMsg(result);
    }

    @Override
    public Map<String, Object> removeChatMessage(int messageNo) {
        int result = chatDAO.deleteChatMessage(messageNo);

        return CommonUtil.resultMsg(result);
    }

    @Override
    public Map<String, Object> getUserNoTest(int chatNo) {
        return chatDAO.selectUserNoTest(chatNo);
    }


//    public List<Map<String, Object>> getChatMessage(Map<String, Object> map) {
//        return chatDAO.selectChatMessage(map);
//    }

//    public <T> void sendMessage(WebSocketSession session, T message) {
//        try{
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        }
//    }
}