package com.ensam.inventia.dto.request;
import jakarta.validation.constraints.NotBlank;
public record JoinTeamRequest(@NotBlank String joinCode) {}
