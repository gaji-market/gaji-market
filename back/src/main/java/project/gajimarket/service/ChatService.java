package project.gajimarket.service;

import org.springframework.web.socket.WebSocketSession;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.chat.ChatRoom;

import java.util.List;
import java.util.Map;

public interface ChatService {

    Map<String, Object> createChatRoom(ChatRoomDTO chatRoomDTO);

    List<ChatRoom> getChatRoomList();

    Map<String, Object> getChatRoom(int chatNo);

    List<Map<String, Object>> getChatMessage(int chatNo);

    <T> void sendMessage(WebSocketSession session, T message);
}
