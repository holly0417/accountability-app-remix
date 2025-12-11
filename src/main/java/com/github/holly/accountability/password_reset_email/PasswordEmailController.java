package com.github.holly.accountability.password_reset_email;

import com.github.holly.accountability.config.GenericResponse;
import com.github.holly.accountability.config.properties.ApplicationProperties;
import com.github.holly.accountability.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.Objects;


@Controller
@RequestMapping("/email")
public class PasswordEmailController {

    private final ApplicationProperties applicationProperties;
    public static final String CHANGE_PASSWORD_FROM_TOKEN = "/change-password-from-token";

    private final PasswordEmailService passwordEmailService;
    private final UserService userService;

    @Autowired
    public PasswordEmailController(PasswordEmailService passwordEmailService,
                                   ApplicationProperties applicationProperties,
                                   UserService userService
    ) {
        this.passwordEmailService = passwordEmailService;
        this.applicationProperties = applicationProperties;
        this.userService = userService;
    }

    @ResponseBody
    @GetMapping("/send-token")
    public GenericResponse sendPasswordEmail(@RequestParam String email) {

        userService.findUserByEmail(email)
                .ifPresent(passwordEmailService::sendPasswordEmail);

        return new GenericResponse("If this email exists in our system, you should find an email in your mailbox.");
    }

    @GetMapping(CHANGE_PASSWORD_FROM_TOKEN + "/{token}")
    public ResponseEntity<?> showChangePasswordFromTokenPage(@PathVariable("token") String token) {
        boolean isValid = passwordEmailService.validatePasswordResetToken(token);

        if (!isValid) {
            String loginUrl = UriComponentsBuilder
                    .fromUriString(applicationProperties.getBaseUrl())
                    .path("/login")
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Location", loginUrl)
                    .build();
        }

        String tokenPasswordChangeUrl = UriComponentsBuilder
                .fromUriString(applicationProperties.getBaseUrl())
                .path(CHANGE_PASSWORD_FROM_TOKEN)
                .queryParam("token", token)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", tokenPasswordChangeUrl)
                .build();
    }

    @ResponseBody
    @PostMapping("/set-new-password")
    public GenericResponse changePasswordFromToken(@RequestBody @Valid ResetPasswordDto passwordDto,
                                                   BindingResult bindingResult
    ) {

        if (!Objects.equals(passwordDto.getPassword(), passwordDto.getPasswordRepeated())) {
            return new GenericResponse("Password inputs must match", true);
        }

        if (!bindingResult.hasErrors()) {
            try {
                passwordEmailService.setNewPassword(passwordDto.getToken(), passwordDto);

                return new GenericResponse(
                        "Password changed successfully!", false);


            }
            catch (Exception e) {
                return new GenericResponse(e.getMessage(), true);
            }
        }

        StringBuilder sb = new StringBuilder();

        for (FieldError error : bindingResult.getFieldErrors()) {
            sb.append(error.getDefaultMessage()).append("\n \n");
        }

        String allErrors = sb.toString();
        return new GenericResponse(allErrors, true);

    }

}
