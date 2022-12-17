package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.ChatRoomDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatDAO {
    int insertChatRoom(ChatRoomDTO chatRoomDTO);

    int insertChatMessage(Map<String, Object> map);

    ChatRoomDTO selectChatRoom(Map<String, Object> map);

    List<Map<String, Object>> selectChatMessage(Map<String, Object> map);

    List<ChatRoomDTO> selectChatRoomList(int userNo);

    int updateChatMessageCheck(Map<String, Object> map);

    int deleteChatRoom(Map<String, Object> map);
}
