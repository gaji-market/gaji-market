package project.gajimarket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.chat.ChatRoom;
import project.gajimarket.service.ChatService;
import project.gajimarket.service.ProductService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;
    private final ProductService productService; //상품정보를 가져오기 위한 서비스

    //채팅방 생성
    @PostMapping
    public Map<String, Object> createChatRoom(@RequestBody ProductDTO productDTO) {
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
        chatRoomDTO.setProdNo(productDTO.getProdNo());
        chatRoomDTO.setTgUserNo(productDTO.getUserNo());
        chatRoomDTO.setUserNo(1); //로그인 세션 값 가져오기

        Map<String, Object> resultMap = new HashMap<>();

        int result = chatService.createChatRoom(chatRoomDTO);

        if (result == 1) {
            chatService.createChatRoom(chatRoomDTO);
        }
        return resultMap;
    }

    @GetMapping
    public ChatRoom getChatRoom(@RequestBody int chatNo) {
        return chatService.getChatRoom(chatNo);
    }

    @GetMapping
    public List<ChatRoom> getChatRoomList(@RequestBody int userNo) {
        return chatService.getChatRoomList();
    }

    //상품정보 공통 처리
    private void getProduct() {

    }
}
