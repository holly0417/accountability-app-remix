package com.github.holly.accountability.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import static com.github.holly.accountability.user.UserUtil.EMAIL_PATTERN;
import static com.github.holly.accountability.user.UserUtil.PASSWORD_PATTERN;

public class RegisterUser {

    @Size(min = 4, max = 60, message = "Must be between 4 and 60 characters.")
    private String username;

    @Size(min = 4, max = 60, message = "Must be between 4 and 60 characters.")
    private String name;

    @Size(min = 4, max = 60, message = "Must be between 4 and 60 characters.")
    @Pattern(regexp = EMAIL_PATTERN, message = "Email must contain @ sign.")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20, message = "Must be between 8 and 20 characters.")
    @Pattern(regexp = PASSWORD_PATTERN, message = "Password must contain at least one uppercase, lowercase, special character, and number.")
    private String password;

    @NotBlank(message = "Repeated password is required")
    private String passwordRepeated;

    public RegisterUser(String username, String name, String email, String password, String passwordRepeated) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.passwordRepeated = passwordRepeated;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
