package com.example.server.service.impl;

import com.example.server.dto.UserDto;
import com.example.server.entity.User;
import com.example.server.exception.UserNotFound;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.UserRepository;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toUserResponse)
                .orElseThrow(() -> new UserNotFound("User not found with email: " + email, HttpStatus.NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toUserResponse)
                .orElseThrow(() -> new UserNotFound("User not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUserById(Long id, UserDto request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("User not found with id: " + id, HttpStatus.NOT_FOUND));

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(user.getEmail())) {
            userRepository.findByEmail(request.getEmail())
                    .ifPresent(u -> {
                        throw new IllegalStateException("Email already taken");
                    });
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getFirstName())) {
            user.setFirstName(request.getFirstName());
        }
        
        if (StringUtils.hasText(request.getLastName())) {
            user.setLastName(request.getLastName());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFound("User not found with id: " + id, HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(id);
    }
}
