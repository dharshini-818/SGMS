package com.sgms.service;

import com.sgms.entity.AuditLog;
import com.sgms.repository.AuditLogRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(String action, String entityName, Long entityId, String performedBy, String details, String ipAddress) {
        AuditLog log = new AuditLog(action, entityName, entityId, performedBy, details, ipAddress);
        auditLogRepository.save(log);
    }
}

