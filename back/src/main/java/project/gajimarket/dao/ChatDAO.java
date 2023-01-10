package project.gajimarket.dao;

import org.apache.ibatis.annotations.Mapper;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.UserDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatDAO {
    int insertChatRoom(ChatRoomDTO chatRoomDTO);

    int insertChatMessage(Map<String, Object> map);

    ChatRoomDTO selectChatRoom(Map<String, Object> map);

    List<Map<String, Object>> selectChatMessage(Map<String, Object> map);

    List<Map<String, Object>> selectChatRoomList(Map<String, Object> map);

    int selectChatRoomListCnt(Map<String, Object> map);

    int updateChatMessageCheck(Map<String, Object> map);

    int deleteChatRoom(int chatNo);

    int deleteChatMessage(int messageNo);

    Map<String, Object> selectUserNoTest(int chatNo);

    UserDTO selectUserInfo(int userNo);
}
