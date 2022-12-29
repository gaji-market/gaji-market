package project.gajimarket.service;

import project.gajimarket.model.ChatRoomDTO;

import java.util.List;
import java.util.Map;

public interface ChatService {

    Map<String, Object> addChatRoom(ChatRoomDTO chatRoomDTO);

    Map<String, Object> addChatMessage(Map<String, Object> map);

    Map<String, Object> getChatRoomList(Map<String, Object> map);

    Map<String, Object> getChatRoom(Map<String, Object> map);

    Map<String, Object> removeChatRoom(int chatNo);

    Map<String, Object> removeChatMessage(int message);

    Map<String, Object> getUserNoTest(int chatNo);

   // List<Map<String, Object>> getChatMessage(Map<String, Object> map);

   // <T> void sendMessage(WebSocketSession session, T message);
}
