package project.gajimarket.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.SearchPagination;
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
    @PostMapping("/addChatRoom")
    public Map<String, Object> addChatRoom(@RequestBody ProductDTO productDTO) {
        log.info("request ProductDTO :: "+productDTO.toString());

        ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
        chatRoomDTO.setProdNo(productDTO.getProdNo());
        chatRoomDTO.setTgUserNo(productDTO.getUserNo());
        chatRoomDTO.setUserNo(1); //로그인 세션 값 가져오기
        //chatRoomDTO.setProdNo(1);
        //chatRoomDTO.setTgUserNo(2);

        log.info("chatRoomDTO :: "+chatRoomDTO.toString());

        //insert 성공 시 getChatRoom 호출
        return chatService.addChatRoom(chatRoomDTO);
    }

    @GetMapping("/getChatRoom/{chatNo}")
    public Map<String, Object> getChatRoom(@PathVariable int chatNo) {
        Map<String, Object> resultMap = chatService.getChatRoom(chatNo);

        try {
            ChatRoomDTO chatRoomDTO = (ChatRoomDTO) resultMap.get("chatRoomInfo");
            resultMap.put("productInfo", getProduct(chatRoomDTO.getProdNo()));

            log.info("resultMap :: " + resultMap);
        } catch (Exception e) {
           log.error(e.toString());
        }

        return resultMap;
    }

    @PostMapping("/getChatRoomList/{userNo}")
    public Map<String, Object> getChatRoomList(@PathVariable int userNo, @RequestBody SearchPagination searchPagination) {
        Map<String, Object> resultMap = new HashMap<>();

        resultMap.put("chatRoomInfos", chatService.getChatRoomList());

        return resultMap;
    }

    @MessageMapping //목적지가 path와 일치하는 메시지를 수신하였을 경우 해당 메소드 호출
    @SendToUser("/queue/message") //해당 path의 구독자에게 발신 (1:1)
    public Message sendMessage(Message message) throws Exception {
       // Thread.sleep(1000); //서버가 메시지를 비동기식으로 처리하기 때문에 클라이언트가 메시지를 보낸 후 처리가 지연될 수 있음....
        log.info("message :: " + message);

        return message;
    }

    // 1:N으로 메시지 발신
    /*
    @MessageMapping
    @SendTo("/topic/message")
    public Map<String, Object> sendMessageTopic() throws Exception {
        Thread.sleep(1000); //서버가 메시지를 비동기식으로 처리하기 때문에 클라이언트가 메시지를 보낸 후 처리가 지연될 수 있음....
        Map<String, Object> map = new HashMap<>();
        return map;
    }
    */

    //상품정보 공통 처리
    private Map<String, Object> getProduct(int productNo) {
        return productService.findProductInfo(productNo);
    }

    @PostMapping("/multiTest")
    public int multiTest(@RequestBody ObjectNode objectNode) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ChatRoomDTO chatRoomDTO = objectMapper.treeToValue(objectNode.get("chatRoomInfo"), ChatRoomDTO.class);
            SearchPagination searchPagination = objectMapper.treeToValue(objectNode.get("searchPagination"), SearchPagination.class);

            log.info(chatRoomDTO.toString());
            log.info(searchPagination.toString());

        } catch (Exception e) {
            log.error(e.toString());
        }

        return 1;
    }
}
