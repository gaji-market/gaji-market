package project.gajimarket;

import project.gajimarket.model.UserDTO;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class Utils {

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

    public static String isEmptyStr(Object obj) {
        if (obj != null && !"".equals(obj)) {
            return (String)obj;
        }
        return "";
    }

    public static UserDTO getUserInfo(HttpServletRequest request) {
        if (request != null) {
            return (UserDTO) request.getSession().getAttribute("userInfo");
        }
        return null;
    }
}
