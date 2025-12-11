package com.github.holly.accountability.config.auth;

import com.github.holly.accountability.user.AccountabilitySessionUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;

import static com.github.holly.accountability.config.auth.WebSecurityConfig.FileExtensionRequestMatcher.extensions;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private AccountabilityUserDetailsService userDetailsService;

    @Autowired
    private FormLoginHandler formLoginHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable).authenticationProvider(authenticationProvider()).authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> authorizationManagerRequestMatcherRegistry.requestMatchers(extensions("css", "js")).permitAll().requestMatchers(extensions("png", "jpg", "jpeg", "svg", "gif")).permitAll().requestMatchers(extensions("woff", "woff2", "tff", "otf")).permitAll().requestMatchers(extensions("ico")).permitAll().requestMatchers("/index.html", "/registration", "/email/**", "/h2-console/**", "/change-password-from-token/**", "/error").permitAll().requestMatchers("/api/**").authenticated().anyRequest().authenticated()).formLogin(logInConfigurer -> logInConfigurer.loginPage("/login").loginProcessingUrl("/api/login").successHandler(formLoginHandler).failureHandler(formLoginHandler).permitAll()).logout(logOutConfigurer -> logOutConfigurer.logoutUrl("/api/logout").logoutSuccessUrl("/login").permitAll()).build();
    }

    static class FileExtensionRequestMatcher implements RequestMatcher {

        private final List<String> extensions;

        private FileExtensionRequestMatcher(String... extensions) {
            this.extensions = Arrays.asList(extensions);
        }

        public static FileExtensionRequestMatcher extensions(String... extensions) {
            return new FileExtensionRequestMatcher(extensions);
        }

        @Override
        public boolean matches(HttpServletRequest request) {
            return extensions.stream().anyMatch(extension -> request.getServletPath().endsWith(extension));
        }
    }

    @Controller
    public class LoginController {

        @GetMapping("/login")
        public ModelAndView login(@AuthenticationPrincipal Object principal) {
            if (principal instanceof AccountabilitySessionUser) {
                return new ModelAndView("redirect:/");
            }
            return new ModelAndView("index.html");
        }
    }

}
