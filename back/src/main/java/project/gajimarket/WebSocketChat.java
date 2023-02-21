package project.gajimarket;

import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import project.gajimarket.config.ServerEndpointConfigurator;
import project.gajimarket.service.ChatService;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
@ServerEndpoint(value = "/socket/chat", configurator = ServerEndpointConfigurator.class)
public class WebSocketChat {
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<>());

    @Autowired
    private ChatService chatService;

    @OnOpen
    public void onOpen(Session session) throws Exception {
        log.info("open session : {}, clients={}", session.toString(), clients);

        if(!clients.contains(session)) {
            clients.add(session);
            log.info("session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) throws Exception {
        log.info("receive message : {}", message);

        String msg = addChatMessage(message);

        for (Session s : clients) {
            log.info("send data : {}", msg);

            s.getBasicRemote().sendText(msg);
        }


    }

    @OnClose
    public void onClose(Session session) {
        log.info("session close : {}", session);
        clients.remove(session);
    }

    public String addChatMessage(String payload) {
        System.out.println("addChatMessage :: " + payload);

        try {
            JSONParser jsonParser = new JSONParser();
            Object obj = jsonParser.parse(payload);

            Map<String, Object> map = (Map<String, Object>) obj;
            chatService.addChatMessage(map);

            return map.get("msg").toString();
        } catch (Exception e) {
            return "";
        }

    }
}
