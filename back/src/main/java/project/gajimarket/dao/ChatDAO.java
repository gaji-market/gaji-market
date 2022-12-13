package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.ChatRoomDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatDAO {
    public int insertChatRoom(ChatRoomDTO chatRoomDTO);

    //ChatRoomDTO selectChatRoom(int chatNo);

    //List<ChatRoomDTO> selectChatRoomList(int userNo);

    //List<Map<String, Object>> selectChatMessage(int chatNo);
}
