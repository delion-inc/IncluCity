package com.example.server.mapper;

import com.example.server.dto.user.UserDto;
import com.example.server.entity.User;
import com.example.server.enums.Role;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDto toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles().stream()
                        .map(role -> role.getValue())
                        .collect(Collectors.toSet()))
                .build();
    }

    public UserDto toUserDto(User createdBy) {
        if (createdBy == null) {
            return null;
        }

        return UserDto.builder()
                .id(createdBy.getId())
                .email(createdBy.getEmail())
                .firstName(createdBy.getFirstName())
                .lastName(createdBy.getLastName())
                .roles(createdBy.getRoles().stream()
                        .map(Role::getValue)
                        .collect(Collectors.toSet()))
                .build();
    }
}
