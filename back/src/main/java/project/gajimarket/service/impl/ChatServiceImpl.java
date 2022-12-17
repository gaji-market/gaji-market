package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.Utils;
import project.gajimarket.dao.ChatDAO;
import project.gajimarket.model.ChatRoomDTO;
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

    public List<ChatRoomDTO> getChatRoomList() {
        return null;
        //return chatDAO.selectChatRoomList(1);
    }

    public Map<String, Object> getChatRoom(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();

        resultMap.put("chatRoomInfo", chatDAO.selectChatRoom(map));
        resultMap.put("chatMessageInfos", chatDAO.selectChatMessage(map));

        if (resultMap.get("chatMessageInfos") != null) {
            chatDAO.updateChatMessageCheck(map);
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