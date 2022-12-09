package project.gajimarket.model.chat;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;
import project.gajimarket.service.ChatService;
import project.gajimarket.service.impl.ChatServiceImpl;

import java.util.HashSet;
import java.util.Set;

@Data
public class ChatRoom {
    private String chatId;
    private String name;
    private Set<WebSocketSession> sessions = new HashSet<>();

    @Builder
    public ChatRoom(String chatId, String name) {
        this.chatId = chatId;
        this.name = name;
    }

   /* public void handlerActions(WebSocketSession session, ChatMessage chatMessage, ChatServiceImpl chatService) {
        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER)) {
            sessions.add(session);
            chatMessage.setMessage(chatMessage.getSenderId() + "님이 입장했습니다.");
        }
        sendMessage(chatMessage, chatService);

    }

    private <T> void sendMessage(T message, ChatServiceImpl chatService) {
        sessions.parallelStream()
                .forEach(session -> chatService.sendMessage(session, message));
    }*/
}
