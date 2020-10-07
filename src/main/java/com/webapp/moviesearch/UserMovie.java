package com.webapp.moviesearch;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "user_movies")
public class UserMovie implements Serializable{
    private static final long serialVersionUID = 2L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column(name = "user_id")
    private String userId;

    public UserMovie() {}

    public UserMovie(String imdbId, String user) {
        this.imdbId = imdbId;
        this.userId = user;
    }

    public Long getId() {
        return id;
    }

    public String getImdbId() {
        return imdbId;
    }

    public String getUser() {
        return userId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setImdbId(String imdbId) {
        this.imdbId = imdbId;
    }

    public void setUser(String user) {
        this.userId = user;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;
        if(!(o instanceof UserMovie))
            return false;
        UserMovie userMovie = (UserMovie) o;
        return Objects.equals(this.id, userMovie.id) && Objects.equals(this.imdbId, userMovie.imdbId) && Objects.equals(this.userId, userMovie.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.imdbId, this.userId);
    }

    @Override
    public String toString() {
        return "UserMovie{" + "id='" + this.id + '\'' + ", imdbId='" + this.imdbId + '\'' + ", userId='" + this.userId + '\'' + '}';
    }
}
