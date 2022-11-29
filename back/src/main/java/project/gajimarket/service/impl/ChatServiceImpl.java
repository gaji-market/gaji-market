package project.gajimarket.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import project.gajimarket.dao.ChatDAO;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.chat.ChatRoom;
import project.gajimarket.service.ChatService;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {
    private final ObjectMapper objectMapper;
    private final ChatDAO chatDAO;
    private Map<String, ChatRoom> chatRooms;

    @PostConstruct
    private void init() {
        chatRooms = new LinkedHashMap<>();
    }

    public int createChatRoom(ChatRoomDTO chatRoomDTO) {
        return chatDAO.insertChatRoom(chatRoomDTO);
    }

    public List<ChatRoom> getChatRoomList() {
        return new ArrayList<>(chatRooms.values());
    }

    public ChatRoom getChatRoom(int chatNo) {
        return chatDAO.selectChatRoom(chatNo);
    }

    public <T> void sendMessage(WebSocketSession session, T message) {
        try{
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }
}