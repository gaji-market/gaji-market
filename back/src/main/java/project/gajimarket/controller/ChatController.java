package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.chat.ChatRoom;
import project.gajimarket.service.ChatService;
import project.gajimarket.service.ProductService;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;
    private final ProductService productService; //상품정보를 가져오기 위한 서비스

    //채팅방 생성
    @PostMapping
    public ChatRoom createChatRoom(@RequestBody String targetId) {
        return chatService.createChatRoom(targetId);
    }

    @GetMapping
    public ChatRoom getChatRoom(@RequestBody String chatId) {
        return chatService.getChatRoom(chatId);
    }

    @GetMapping
    public List<ChatRoom> getChatRoomList(@RequestBody String userId) {
        return chatService.getChatRoomList();
    }

    //상품정보 공통 처리
    private void getProduct() {

    }
}
