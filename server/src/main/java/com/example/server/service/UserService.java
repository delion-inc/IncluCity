package com.example.server.service;

import com.example.server.dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto getCurrentUserByEmail(String email);

    UserDto getUserById(Long id);

    List<UserDto> getAllUsers();

    UserDto updateUserById(Long id, UserDto userDto);

    void deleteUserById(Long id);
}
