package com.github.holly.accountability.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


public class AccountabilitySessionUser implements UserDetails {

    private final Long id;
    private final String name;
    private final String username;
    private final String email;
    private final String password;
    private final List<GrantedAuthority> authorities;

    public AccountabilitySessionUser(Long id, String name, String email, String username, String password, List<GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() { return email; }
}
