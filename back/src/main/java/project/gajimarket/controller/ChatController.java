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
    public Map<String, Object> addChatRoom(@RequestBody ProductDTO productDTO) {
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
        chatRoomDTO.setProdNo(productDTO.getProdNo());
        chatRoomDTO.setTgUserNo(productDTO.getUserNo());
        chatRoomDTO.setUserNo(1); //로그인 세션 값 가져오기

        //insert 성공 시 getChatRoom 호출
        return chatService.addChatRoom(chatRoomDTO);
    }

    @GetMapping
    public Map<String, Object> getChatRoom(@RequestBody int chatNo) {
        Map<String, Object> resultMap = chatService.getChatRoom(chatNo);

        ChatRoomDTO chatRoomDTO = (ChatRoomDTO) resultMap.get("chatRoomInfo");
        resultMap.put("productInfo", getProduct(chatRoomDTO.getProdNo()));

        resultMap.put("resultMap", resultMap);
        return resultMap;
    }

    @GetMapping
    public Map<String, Object> getChatRoomList(@RequestBody int userNo) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("chatRoomInfos", chatService.getChatRoomList());

        return resultMap;
    }

    //상품정보 공통 처리
    private ProductDTO getProduct(int productNo) {
        return productService.findProductInfo(productNo);
    }
}
