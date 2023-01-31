package project.gajimarket.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.SearchPagination;
import project.gajimarket.service.ChatService;
import project.gajimarket.service.ProductService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;


@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;
    private final ProductService productService; //상품정보를 가져오기 위한 서비스

    //채팅방 생성
    @Operation(summary = "채팅방 생성", description = "채팅방 생성 API")
    @PostMapping("/addChatRoom/{userNo}")
    public Map<String, Object> addChatRoom(
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo,
            @RequestBody ProductDTO productDTO, HttpServletRequest request) {
        try {
            log.info("request ProductDTO :: "+productDTO.toString());

            /*if (CommonUtil.getUserInfo(request) == null) {
                return CommonUtil.resultMsg();
            }*/

            ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
            chatRoomDTO.setProdNo(productDTO.getProdNo());
            chatRoomDTO.setTgUserNo(productDTO.getUserNo());
            //chatRoomDTO.setUserNo(CommonUtil.getUserInfo(request).getUserNo());
            chatRoomDTO.setUserNo(userNo);

            log.info("chatRoomDTO :: "+chatRoomDTO);

            //insert 성공 시 getChatRoom 호출
            return chatService.addChatRoom(chatRoomDTO);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "채팅 메시지 저장", description = "채팅 메시지 저장 API")
    @PostMapping("/addChatMessage/{userNo}")
    public Map<String, Object> addChatMessage(@RequestBody Map<String, Object> map) {
        try {
            System.out.println("addChatMessage");
            return CommonUtil.resultMsg("ee");
            //return chatService.addChatMessage(map);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    public Map<String, Object> chatMessage(String message) {
        try {
            System.out.println("addChatMessage :: " + message);
            return CommonUtil.resultMsg("ee");
            //return chatService.addChatMessage(map);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "채팅방 입장", description = "채팅방 입장 API (채팅방 정보 / 상품 정보), userNo에는 해당 채팅방을 참여하고 있는 유저번호가 들어가야하기 때문에 ''을 통해 참여 유저 확인 후 입력")
    @GetMapping("/getChatRoom/{chatNo}/{userNo}")
    public Map<String, Object> getChatRoom(
            @ApiParam(value = "채팅번호", defaultValue = "1") @PathVariable int chatNo,
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo,
            HttpServletRequest request) {
        try {
            /*if (CommonUtil.getUserInfo(request) == null) {
                return CommonUtil.resultMsg();
            }*/

            Map<String, Object> map = new HashMap<>();
            map.put("chatNo", chatNo);
            //map.put("userNo", CommonUtil.getUserInfo(request).getUserNo());
            map.put("userNo", userNo);

            Map<String, Object> resultMap = chatService.getChatRoom(map);

            ChatRoomDTO chatRoomDTO = (ChatRoomDTO) resultMap.get("chatRoomInfo");
            resultMap.put("productInfo", getProduct(chatRoomDTO.getProdNo()));

            log.info("resultMap :: " + resultMap);

            return resultMap;
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "참여 채팅방 리스트", description = "참여 채팅방 리스트(상대방 닉네임, 마지막 대화, 읽지 않은 메시지 갯수)")
    @PostMapping("/getChatRoomList/{userNo}")
    public Map<String, Object> getChatRoomList(
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo,
            @RequestBody SearchPagination searchPagination, HttpServletRequest request) {
        log.info("SearchPagination :: " + searchPagination.toString());

        try {
            /*if (CommonUtil.getUserInfo(request) == null) {
                return CommonUtil.resultMsg();
            }*/

            Map<String, Object> map = new HashMap<>();
            map.put("schPage", searchPagination);
            //map.put("userNo", CommonUtil.getUserInfo(request).getUserNo());
            map.put("userNo", userNo);

            return chatService.getChatRoomList(map);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @GetMapping("/removeChatRoom/{chatNo}")
    public Map<String, Object> removeChatRoom(
            @ApiParam(value = "채팅번호", defaultValue = "1") @PathVariable int chatNo) {

        try {
            return chatService.removeChatRoom(chatNo);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @GetMapping("/removeChatMessage/{messageNo}")
    public Map<String, Object> removeChatMessage(
            @ApiParam(value = "채팅메시지 번호", defaultValue = "1") @PathVariable int messageNo) {

        try {
            return chatService.removeChatMessage(messageNo);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    //상품정보 공통 처리
    private Map<String, Object> getProduct(int prodNo) {
        return productService.productDetail(prodNo);
    }

    @Operation(summary = "개인 테스트 용도")
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

    @Operation(summary = "getChatRoom 참여 유저 확인용 API")
    @ApiResponse(description = "userNo = 유저번호, tgUserNo = 타겟유저번호(상품 판매자)")
    @GetMapping("/getUserNo/{chatNo}")
    public Map<String, Object> getUserNo_Test(@ApiParam(value = "채팅번호", defaultValue = "1")  @PathVariable int chatNo) {
        return chatService.getUserNoTest(chatNo);
    }
}
