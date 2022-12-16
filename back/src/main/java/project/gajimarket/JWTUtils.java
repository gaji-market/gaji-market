package project.gajimarket;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import project.gajimarket.model.UserDTO;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Map;

public class JWTUtils {

    // 시크릿 키
    private static final String jwtSecretKey = "gajiMarket";
    private static final String id = "id";
    private static final String pwd ="pwd";

    // 시간
    private Long tokenValidTime = 1000L * 60 * 60;
    
    // 토큰 생성
    public static String createAccessToken(Map<String, Object> paramMap) {
        Date now = new Date();
        String token = "";

        try {
            token = Jwts.builder()
                    .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                    .setIssuer("makeJwt")
                    .setIssuedAt(now)
                    //.setExpiration(new Date(now.getTime() + tokenValidTime))
                    .claim("userInfo", paramMap)
                    .signWith(SignatureAlgorithm.HS256, jwtSecretKey)
                    .compact();
        } catch (Exception e) {
            System.out.println("util createAccesToken : " + e);
        }
        return token;
    }

    // 헤더에서 토큰 가져옴
    public static String getHeaderToken(HttpServletRequest request) {
        return request.getHeader("X-AUTH-TOKEN");
    }

    // 토큰 정보
    public static Map<String, Object> getTokenInfo(String token) {
        Map<String, Object> userInfo = null;
        try {
            userInfo = (Map<String, Object>) Jwts.parser()
                    .setSigningKey(jwtSecretKey)
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userInfo");
        } catch (Exception e) {
            System.out.println("util getAuth : " + e);
        }
        return userInfo;
    }

    public Claims parseToken(String authorizationHeader) {
        validationAuthroizationHeader(authorizationHeader);
        String token = extractToken(authorizationHeader);

        return Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(authorizationHeader)
                .getBody();
    }

    private void validationAuthroizationHeader(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException();
        }
    }

    private String extractToken(String authorizationHeader) {
        return authorizationHeader.substring("Bearer ".length());
    }
}
