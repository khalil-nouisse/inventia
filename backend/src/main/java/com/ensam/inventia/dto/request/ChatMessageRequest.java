package com.ensam.inventia.dto.request;
import jakarta.validation.constraints.NotBlank;
public record ChatMessageRequest(@NotBlank String content) {}
