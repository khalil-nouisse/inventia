package com.ensam.inventia.dto.response;
import java.time.LocalDateTime;
public record ChatMessageResponse(Long id, String content, UserResponse sender, LocalDateTime createdAt) {}
