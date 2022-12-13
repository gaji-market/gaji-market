package project.gajimarket;

import java.util.HashMap;
import java.util.Map;

public class Utils {

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
}
