package com.Hoctructuyenchieu.Ecommerce.service;
import com.Hoctructuyenchieu.Ecommerce.web.dto.AuthDto;

public interface AuthService {
    AuthDto.AuthResponse login(AuthDto.LoginRequest loginRequest);
    AuthDto.UserDto register(AuthDto.RegisterRequest registerRequest);
    AuthDto.UserDto getCurrentUser(String username);
}
