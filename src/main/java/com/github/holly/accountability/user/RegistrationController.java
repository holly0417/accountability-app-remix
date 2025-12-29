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
import java.util.Optional;


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
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterUser registerUser,
                                          BindingResult bindingResult
    ) {

        if (userRepository.findUserByEmail(registerUser.getEmail()).isPresent()) {
            bindingResult.rejectValue("email", "Email already in use.");
        }

        if (userRepository.findByUsernameIgnoreCase(registerUser.getUsername()).isPresent()) {
            bindingResult.rejectValue("username", "Username already in use.");
        }

        if (!Objects.equals(registerUser.getPassword(), registerUser.getPasswordRepeated())) {
            bindingResult.rejectValue("password", "Passwords do not match.");
        }

        if (bindingResult.hasErrors()) {
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

        //REACT ROUTER V7: FOR SPA, USE 200 OR 201 FOR SUCCESSFUL RESPONSE
        return new ResponseEntity<Void>(
                MultiValueMap.fromSingleValue(Map.of("Location", "/login")),
                HttpStatus.OK
        );
    }

}
