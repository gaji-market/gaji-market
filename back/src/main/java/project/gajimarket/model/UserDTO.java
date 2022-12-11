package project.gajimarket.model;

import lombok.Data;
import project.gajimarket.model.file.FileDTO;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

@Data
public class UserDTO {
    private int userNo; // 유저번호
    private String userId; // 아이디
    private String userPwd; // 비번
    private String userName; // 사용자 이름
    private String userNickName; // 사용자 닉네임
    private int userGender; // 성별 (0: 남자, 1: 여자)
    private String userBirth; // 생년월일
    private String userPhone; // 전화번호
    private String userAddress; // 주소
    private int reportCnt; // 신고횟수
    private FileDTO profileImg; // 프로필이미지
    private int profileImgNum; // 프로필이미지 num
    private float starScore; // 별점평균
    private char socialKind; // 소셜로그인종류 (0: 일반, 1: 카카오, 2: 구글)
    private char chatNtfct; // 채팅알림유무 (Y, N)
    private char cmntsNtfct; // 댓글알림유무 (Y, N)
    private char interstNtfct; // 좋아요알림유무 (Y, N)
    private char outYn; // 탈퇴유무 (Y, N)
}