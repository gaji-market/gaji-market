package project.gajimarket.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@RequiredArgsConstructor
@Configuration
@EnableWebSocket //웹소켓 활성화
//Handler와 webSocket 주소를 WebSocketHandlerRegistry에 추가해주면, 해당 주소로 접근하면 웹소켓 연결
public class WebSocketConfig implements WebSocketConfigurer {

    //final 이나 @NotNull이 붙은 객체를 '@RequiredArgsConstructor'가 어노테이션 생략해도 자동 생성해주기 때문에 있어야함
    private final WebSocketHandler webSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "ws/chat").setAllowedOrigins("*");
    }
}
