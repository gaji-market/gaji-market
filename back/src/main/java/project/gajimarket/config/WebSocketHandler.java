package project.gajimarket.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import project.gajimarket.controller.ChatController;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final ChatController chatController;
    private Set<WebSocketSession> sessions = new HashSet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload : {}", payload);

        String msg = chatController.addChatMessage(payload);
        System.out.println("parser msg :: " + msg);

        TextMessage initial = new TextMessage(msg);

//        sessions.add(session);
//        for (WebSocketSession s : sessions) {
//            sendMessage(s, msg);
//        }

        session.sendMessage(initial);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
    }

    private <T> void sendMessage(WebSocketSession session, String message) throws IOException {
           session.sendMessage(new TextMessage(message));
    }
}
