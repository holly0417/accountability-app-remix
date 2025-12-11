package com.github.holly.accountability.config.auth;

import com.github.holly.accountability.user.AccountabilitySessionUser;
import com.github.holly.accountability.user.User;
import com.github.holly.accountability.user.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountabilityUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User databaseUser = userRepository
                .findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return new AccountabilitySessionUser(
                databaseUser.getId(),
                databaseUser.getName(),
                databaseUser.getEmail(),
                databaseUser.getUsername(),
                databaseUser.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
