package project.gajimarket;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JWTUtils {

    // 시크릿 키
    private static final String jwtSecretKey = "gajiMarket";

    // 시간
    private Long tokenValidTime = 1000L * 60 * 60;
    
    // 토큰 생성
    public static String createAccessToken(String id, String pwd) {
        Date now = new Date();

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer("makeJwt")
                .setIssuedAt(now)
                //.setExpiration(new Date(now.getTime() + tokenValidTime))
                .claim("id", id)
                .claim("pwd", pwd)
                .signWith(SignatureAlgorithm.HS256, jwtSecretKey)
                .compact();
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
