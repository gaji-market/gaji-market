package project.gajimarket.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@RequiredArgsConstructor
@Configuration
@EnableWebSocket //웹소켓 활성화
//Handler와 webSocket 주소를 WebSocketHandlerRegistry에 추가해주면, 해당 주소로 접근하면 웹소켓 연결
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler,"/ws/chat").setAllowedOriginPatterns("*");
    }
}
