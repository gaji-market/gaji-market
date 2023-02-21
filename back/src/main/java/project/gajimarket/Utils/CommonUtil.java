package project.gajimarket.Utils;

import org.apache.commons.collections4.MapUtils;
import project.gajimarket.model.UserDTO;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class CommonUtil {

    public static Map<String, Object> resultMsg() {
        return resultMsg(0);
    }

    public static Map<String, Object> resultMsg(int result) {
        Map<String, Object> map = new HashMap<>();
        map.put("value", result);

        String msg = "Fail";
        if (result > 0) {
            msg = "Success";
        }

        map.put("msg", msg);

        return map;
    }

    public static Map<String, Object> resultMsg(String msg) {
        Map<String, Object> map = new HashMap<>();
        map.put("result", -999);
        map.put("msg", "[Fail Message] " + msg);

        return map;
    }

    public static String isEmptyStr(Object obj) {
        if (obj != null && !"".equals(obj)) {
            return (String)obj;
        }
        return "";
    }

    public static UserDTO getUserInfo(HttpServletRequest request) {
        String headerToken = JWTUtil.getHeaderToken(request);

        // 토큰 복호화
        if (headerToken != null && !"".equals(headerToken)) {
            Map<String, Object> map = JWTUtil.getTokenInfo(headerToken);
            UserDTO userDTO = new UserDTO();

            if (MapUtils.getInteger(map, "userNo") != null) {
                userDTO.setUserNo(MapUtils.getInteger(map, "userNo"));
            }
            userDTO.setUserNickName(MapUtils.getString(map,"userNickName"));

            return userDTO;
        }

        return null;
    }
}
