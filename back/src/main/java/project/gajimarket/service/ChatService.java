package project.gajimarket.service;

import project.gajimarket.model.ChatRoomDTO;

import java.util.List;
import java.util.Map;

public interface ChatService {

    Map<String, Object> addChatRoom(ChatRoomDTO chatRoomDTO);

    Map<String, Object> addChatMessage(Map<String, Object> map);

    Map<String, Object> getChatRoomList(Map<String, Object> map);

    Map<String, Object> getChatRoom(Map<String, Object> map);

    Map<String, Object> removeChatRoom(Map<String, Object> map);

   // List<Map<String, Object>> getChatMessage(Map<String, Object> map);

   // <T> void sendMessage(WebSocketSession session, T message);
}
