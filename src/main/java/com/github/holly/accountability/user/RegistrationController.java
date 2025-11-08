package com.github.holly.accountability.user;

import com.github.holly.accountability.validation.BindingResultWrapper;
import com.github.holly.accountability.wallet.Wallet;
import com.github.holly.accountability.wallet.WalletRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

@Controller
@RequestMapping("/registration")
@ResponseBody
public class RegistrationController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;

    @Autowired
    public RegistrationController(UserRepository userRepository, PasswordEncoder passwordEncoder, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.walletRepository = walletRepository;
    }

    @PostMapping("")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterUser registerUser, BindingResult bindingResult){

        if (!Objects.equals(registerUser.getPassword(), registerUser.getPasswordRepeated())) {
            bindingResult.rejectValue("password", "Passwords do not match.");
            return new ResponseEntity<>(new BindingResultWrapper(bindingResult), HttpStatus.BAD_REQUEST);
        }

        if (!patternMatches(registerUser.getPassword(), "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,20}$")) {
            bindingResult.rejectValue("password", "Password not in correct format.");
            return new ResponseEntity<>(new BindingResultWrapper(bindingResult), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.findByUsernameIgnoreCase(registerUser.getUsername()).isPresent()) {
            bindingResult.rejectValue("username", "Sorry, this username already exists.");
            return new ResponseEntity<>(new BindingResultWrapper(bindingResult), HttpStatus.BAD_REQUEST);
        }

        if (!patternMatches(registerUser.getEmail(), "^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")) {
            bindingResult.rejectValue("email", "Email is not in correct format. needs to have (@) symbol");
            return new ResponseEntity<>(new BindingResultWrapper(bindingResult), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.findUserByEmail(registerUser.getEmail()).isPresent()) {
            bindingResult.rejectValue("email", "Sorry, a user with this email already exists.");
            return new ResponseEntity<>(new BindingResultWrapper(bindingResult), HttpStatus.BAD_REQUEST);
        }


        User user = userRepository.save(
                        new User(
                            registerUser.getUsername(),
                            registerUser.getName(),
                            passwordEncoder.encode(registerUser.getPassword()),
                            registerUser.getEmail()
                        )
        );


        walletRepository.save(new Wallet(user));

        return new ResponseEntity<Void>(MultiValueMap.fromSingleValue(Map.of("Location", "/login")), HttpStatus.FOUND);
    }

    private static boolean patternMatches(String emailAddress, String regexPattern) {

        return Pattern.compile(regexPattern)
                .matcher(emailAddress)
                .matches();
    }


}
