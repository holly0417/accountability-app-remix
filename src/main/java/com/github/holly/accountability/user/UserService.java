
package com.github.holly.accountability.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto convertUserToDto(User user){

        UserDto userDto = new UserDto();

        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());

        return userDto;
    }

    public User findUserById(Long userId){
        return userRepository.findUserById(userId);
    }

    public Optional<User> findUserByEmail(String email){
        return userRepository.findUserByEmail(email);
    }

    public User saveChangesToUser(User user){
        return userRepository.save(user);
    }

    public List<User> findUsersByNameExceptOne(String name, Long currentUserId){
        List<User> searchList = userRepository.findUsersByUsernameContainsIgnoreCase(name);
        String excludedName = findUserById(currentUserId).getUsername();

        return searchList.stream()
                .filter(thisPartner ->
                        !thisPartner.getUsername().equals(excludedName))
                .toList();
    }

}
