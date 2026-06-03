package org.rabin.devicemonitoringservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.rabin.devicemonitoringservice.dto.AuthDto;
import org.rabin.devicemonitoringservice.entity.User;
import org.rabin.devicemonitoringservice.repository.UserRepository;
import org.rabin.devicemonitoringservice.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setLastLogin(Instant.now());
            userRepository.save(user);

            String token = tokenProvider.generateToken(user.getUsername(), user.getRole());

            AuthDto.LoginResponse response = new AuthDto.LoginResponse();
            response.setToken(token);
            response.setUsername(user.getUsername());
            response.setRole(user.getRole());

            return response;

        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            throw new RuntimeException("Invalid username or password");
        }
    }
}

