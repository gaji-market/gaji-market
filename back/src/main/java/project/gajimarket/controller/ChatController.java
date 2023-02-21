package project.gajimarket.controller;

import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;
import org.springframework.web.bind.annotation.*;
import project.gajimarket.Utils.CommonUtil;
import project.gajimarket.model.ChatRoomDTO;
import project.gajimarket.model.ProductDTO;
import project.gajimarket.model.SearchPagination;
import project.gajimarket.service.ChatService;
import project.gajimarket.service.ProductService;

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
            @RequestBody ProductDTO productDTO) {
        try {
            log.info("request ProductDTO :: "+productDTO.toString());

            ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
            chatRoomDTO.setProdNo(productDTO.getProdNo());
            chatRoomDTO.setTgUserNo(productDTO.getUserNo());
            chatRoomDTO.setUserNo(userNo);

            log.info("chatRoomDTO :: "+chatRoomDTO);

            //insert 성공 시 getChatRoom 호출
            return chatService.addChatRoom(chatRoomDTO);
        } catch (Exception e) {
            log.error(e.toString());
            return CommonUtil.resultMsg(e.toString());
        }
    }

    @Operation(summary = "채팅방 입장", description = "채팅방 입장 API (채팅방 정보 / 상품 정보), userNo에는 해당 채팅방을 참여하고 있는 유저번호가 들어가야하기 때문에 ''을 통해 참여 유저 확인 후 입력")
    @GetMapping("/getChatRoom/{chatNo}/{userNo}")
    public Map<String, Object> getChatRoom(
            @ApiParam(value = "채팅번호", defaultValue = "1") @PathVariable int chatNo,
            @ApiParam(value = "유저번호", defaultValue = "1") @PathVariable int userNo) {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("chatNo", chatNo);
            map.put("userNo", userNo);

            Map<String, Object> resultMap = chatService.getChatRoom(map);

            if (MapUtils.getObject(resultMap,"chatRoomInfo") == null) {
                return CommonUtil.resultMsg("There's no ChatRoomInfo");
            }

            ChatRoomDTO chatRoomDTO = (ChatRoomDTO) MapUtils.getObject(resultMap,"chatRoomInfo");
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
            @RequestBody SearchPagination searchPagination) {
        log.info("SearchPagination :: " + searchPagination.toString());

        try {

            Map<String, Object> map = new HashMap<>();
            map.put("schPage", searchPagination);
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
}
