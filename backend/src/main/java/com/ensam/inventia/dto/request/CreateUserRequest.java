package com.ensam.inventia.dto.request;
import jakarta.validation.constraints.*;
import com.ensam.inventia.enums.RoleEnum;
public record CreateUserRequest(@NotBlank String username, @NotBlank @Email String email, @NotBlank @Size(min=6) String password, @NotBlank String firstName, @NotBlank String lastName, @NotNull RoleEnum role) {}
