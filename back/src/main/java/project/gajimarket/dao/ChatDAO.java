package project.gajimarket.dao;

import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.chat.ChatRoom;

import java.util.List;
import java.util.Map;

public interface ChatDAO {
    int insertChatRoom(ChatRoomDTO chatRoomDTO);

    ChatRoom selectChatRoom(int chatNo);

    List<ChatRoom> selectChatRoomList(int userNo);

    List<Map<String, Object>> selectChatMessage(int chatNo);
}
