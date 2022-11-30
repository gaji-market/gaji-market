package project.gajimarket.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.gajimarket.service.NotifiService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Service
public class NotifiServiceImpl implements NotifiService {

    @Override
    public int addNotification(Map<String, Object> map) {
        return 0;
    }

    @Override
    public Map<String, Object> getNotification() {
        return null;
    }

    @Override
    public List<Map<String, Object>> getNotificationList() {
        return null;
    }

    @Override
    public int updateNotification(Map<String, Object> map) {
        return 0;
    }
}
