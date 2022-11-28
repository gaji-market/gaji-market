package project.gajimarket.model.chat;

import lombok.Data;

@Data
public class ChatMessage {
    public enum MessageType {
        ENTER, TALK
    }

    private MessageType type;
    private String chatId;
    private String senderId;
    private String targetId;
    private String message;
    private char checkYn;
    private String date;
}
