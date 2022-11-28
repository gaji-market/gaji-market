package project.gajimarket.dao;

import project.gajimarket.model.chat.ChatRoom;

import java.util.List;
import java.util.Map;

public interface ChatDAO {
    int insertChatRoom(ChatRoom chatRoom);

    ChatRoom selectChatRoom(String chatId);

    List<ChatRoom> selectChatRoomList(String userId);

    List<Map<String, Object>> selectChatMessage(String chatId);
}
