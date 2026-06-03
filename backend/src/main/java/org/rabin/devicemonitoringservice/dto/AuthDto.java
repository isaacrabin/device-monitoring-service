package org.rabin.devicemonitoringservice.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String username;
        private String role;
        private String tokenType = "Bearer";
    }
}
