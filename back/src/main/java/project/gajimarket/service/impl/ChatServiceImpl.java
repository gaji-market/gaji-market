package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.Utils;
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
        int result = chatDAO.insertChatRoom(chatRoomDTO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", Utils.resultMsg(result));
        resultMap.put("chatInfo", chatRoomDTO);

        return resultMap;
    }

    @Override
    public Map<String, Object> addChatMessage(Map<String, Object> map) {

        int result = chatDAO.insertChatMessage(map);

        return Utils.resultMsg(result);
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

        int result = chatDAO.updateChatMessageCheck(map);

        if (result > 0) {
            resultMap.put("chatRoomInfo", chatDAO.selectChatRoom(map));
            resultMap.put("chatMessageInfos", chatDAO.selectChatMessage(map));
        } else {
            resultMap.put("result", Utils.resultMsg(result));
        }
        return resultMap;
    }

    @Override
    public Map<String, Object> removeChatRoom(Map<String, Object> map) {
        int result = chatDAO.deleteChatRoom(map);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", Utils.resultMsg(result));

        return resultMap;
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