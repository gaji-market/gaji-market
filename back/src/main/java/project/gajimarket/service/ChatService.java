package project.gajimarket.service;

import org.springframework.web.socket.WebSocketSession;
import project.gajimarket.model.chat.ChatRoom;

import java.util.List;

public interface ChatService {

    ChatRoom createChatRoom(String targetId);

    List<ChatRoom> getChatRoomList();

    ChatRoom getChatRoom(String roomId);

    <T> void sendMessage(WebSocketSession session, T message);
}
