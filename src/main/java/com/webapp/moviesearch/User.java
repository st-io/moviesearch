package com.webapp.moviesearch;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "r_user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;
    @Column(name = "password")
    private String password;

    public User() {}

    public User(String id, String password) {
        this.id = id;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;
        if(!(o instanceof User))
            return false;
        User user = (User) o;
        return Objects.equals(this.id, user.id) && Objects.equals(this.password, user.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.password);
    }

    @Override
    public String toString() {
        return "User{" + "id='" + this.id + '\'' + ", password='" + this.password + '\'' + '}';
    }
}
