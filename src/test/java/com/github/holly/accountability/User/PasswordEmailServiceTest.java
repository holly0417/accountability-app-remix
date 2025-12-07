package com.github.holly.accountability.User;

import com.github.holly.accountability.config.GenericResponse;
import com.github.holly.accountability.config.properties.ApplicationProperties;
import com.github.holly.accountability.password_reset_email.PasswordEmailService;
import com.github.holly.accountability.password_reset_email.ResetPasswordDto;
import com.github.holly.accountability.user.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PasswordEmailServiceTest {

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserService userService;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private JavaMailSenderImpl mailSender;

    @InjectMocks
    private PasswordEmailService passwordEmailService;


    //test if a method will throw an exception if wrong input given
    @Test
    public void EmailService_setNewPassword_ThrowsException(){
        User user = new User();
        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user);
        when(passwordResetTokenRepository.save(passwordResetToken)).thenReturn(passwordResetToken);
        passwordResetTokenRepository.save(passwordResetToken);

        ResetPasswordDto matchingAndFormattedPasswordDto = new ResetPasswordDto("Changedpass@app1", "Changedpass@app1");
        ResetPasswordDto notMatchingPasswordDto = new ResetPasswordDto("notMatching@app", "Changedpass@app1");

        String unusedToken = UUID.randomUUID().toString();

        when(passwordResetTokenRepository.findByToken(token)).thenReturn(Optional.of(passwordResetToken));
        when(passwordResetTokenRepository.findByToken(unusedToken)).thenReturn(Optional.empty());

        assertThrows(PasswordEmailService.PasswordsNotMatchingException.class, () -> passwordEmailService.setNewPassword(token, notMatchingPasswordDto));

        assertThrows(RuntimeException.class, () -> passwordEmailService.setNewPassword(unusedToken, matchingAndFormattedPasswordDto));

        //checks if anything was saved in the userRepository using Mockito.any
        verify(userService, times(0)).saveChangesToUser(any(User.class));
        //verify(userRepository, times(0)).save(any(User.class));

        //instead of times(0), we can also use never()
        //verify(userRepository, never()).save(any(User.class));

        passwordEmailService.setNewPassword(token, matchingAndFormattedPasswordDto);
        verify(userService, times(1)).saveChangesToUser(any(User.class));
    }

}
