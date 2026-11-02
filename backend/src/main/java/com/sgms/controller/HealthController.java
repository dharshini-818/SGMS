package com.sgms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("application", "Student Grade Management System (SGMS)");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now());
        status.put("database", "CONNECTED");
        return ResponseEntity.ok(status);
    }
}

