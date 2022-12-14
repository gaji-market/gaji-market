package project.gajimarket.model;

import lombok.Data;

@Data
public class ChatRoomDTO {
    private int chatNo; //채팅방 번호
    private int prodNo; //상품 번호
    private int userNo; //유저 번호
    private int tgUserNo; //타겟 유저 번호
}
