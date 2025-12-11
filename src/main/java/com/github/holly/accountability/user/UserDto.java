//WHY: object that holds a user's data needed for frontend
//excludes password for security reasons

package com.github.holly.accountability.user;

import java.util.Objects;

public class UserDto {

    private Long id;

    private String username;

    private String email;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean equals(Object compared) {

        if(this == compared){

            return true;
        }

        UserDto userDtoCompared = (UserDto) compared;

        return Objects.equals(this.id, userDtoCompared.id) &&
                Objects.equals(this.username, userDtoCompared.username) &&
                Objects.equals(this.email, userDtoCompared.email);
    }
}
