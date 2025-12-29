//WHY: to be able to get the current user's ID and Username
//whenever it's needed in the frontend without providing password

package com.github.holly.accountability.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/user")
@ResponseBody
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    @GetMapping("")
    public ResponseEntity<UserDto> getUser(@AuthenticationPrincipal AccountabilitySessionUser user) {

        UserDto userDto = new UserDto();

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userDto.setUsername(user.getUsername());
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/all-platform-users")
    public Page<UserDto> getAllPlatformUsers(@AuthenticationPrincipal AccountabilitySessionUser user,
                                             @PageableDefault(size = 20) Pageable pageable
    ) {

        return userRepository.getAllExceptCurrentUser(user.getId(), pageable)
                .map(res -> userService.convertUserToDto(res));
    }

}
