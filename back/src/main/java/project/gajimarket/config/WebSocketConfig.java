package project.gajimarket.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@RequiredArgsConstructor
@Configuration
@EnableWebSocketMessageBroker //웹소켓 활성화
//Handler와 webSocket 주소를 WebSocketHandlerRegistry에 추가해주면, 해당 주소로 접근하면 웹소켓 연결
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue"); //메시지 브로커를 등록하는 코드 (topic = 1:N, queue = 1:1
        registry.setApplicationDestinationPrefixes("/"); //도착 경로에 대한 prefix를 설정 (ex. /topic/hello 라는 토픽에 대해 구독을 신청 시 실제 경로는 '/chat'으로 설정 시 /chat/topic/hello)
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
        //=> 연결할 소켓 엔트 포인트를 지정하는 코드. ws/chat 이라는 endpoint에 interceptor를 추가해 소켓을 등록
    }


}
