package com.github.holly.accountability.password_reset_email;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import static com.github.holly.accountability.user.UserUtil.PASSWORD_PATTERN;

public class ResetPasswordDto {

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20, message = "Must be between 8 and 20 characters.")
    @Pattern(regexp = PASSWORD_PATTERN, message = "Password must contain at least one uppercase, lowercase, special character (not -), and number.")
    private String password;

    @NotBlank(message = "Password is required")
    private String passwordRepeated;

    private String token;

    public ResetPasswordDto() {
    }

    public ResetPasswordDto(String password, String passwordRepeated) {
        this.password = password;
        this.passwordRepeated = passwordRepeated;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordRepeated() {
        return passwordRepeated;
    }

    public void setPasswordRepeated(String passwordRepeated) {
        this.passwordRepeated = passwordRepeated;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
