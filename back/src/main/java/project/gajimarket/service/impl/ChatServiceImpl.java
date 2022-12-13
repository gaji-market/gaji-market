package project.gajimarket.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import project.gajimarket.dao.ChatDAO;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.service.ChatService;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service("chatService")
public class ChatServiceImpl implements ChatService {

    private final ChatDAO chatDAO;
    //private Map<String, ChatRoom> chatRooms;

    public Map<String, Object> addChatRoom(ChatRoomDTO chatRoomDTO) {
        Map<String, Object> resultMap = new HashMap<>();

        int result = chatDAO.insertChatRoom(chatRoomDTO);

        Map<String, Object> map = new HashMap<>();
        map.put("value", result);

        if (result > 0) {
            map.put("message", "Success");
            resultMap.put("chatInfo", chatRoomDTO);
        } else {
            map.put("message", "Fail");
        }

        resultMap.put("result", map);
        return resultMap;
    }

    public List<ChatRoomDTO> getChatRoomList() {
        return null;
        //return chatDAO.selectChatRoomList(1);
    }

    public Map<String, Object> getChatRoom(int chatNo) {
        Map<String, Object> resultMap = new HashMap<>();

        //resultMap.put("chatRoomInfo", chatDAO.selectChatRoom(chatNo));
        resultMap.put("chatMessageInfos", getChatMessage(chatNo));

        return resultMap;
    }

    public List<Map<String, Object>> getChatMessage(int chatNo) {
        return null;
        //return chatDAO.selectChatMessage(chatNo);
    }

//    public <T> void sendMessage(WebSocketSession session, T message) {
//        try{
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        }
//    }
}