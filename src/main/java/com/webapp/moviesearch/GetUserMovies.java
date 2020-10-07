package com.webapp.moviesearch;

import java.io.Serializable;
import java.util.List;

public class GetUserMovies implements Serializable {
    private static final long serialVersionUID = 3L;

    private List<UserMovie> movies;

    public GetUserMovies() {}

    public GetUserMovies(List<UserMovie> movies) {
        this.movies = movies;
    }

    public void setMovies(List<UserMovie> movies) {
        this.movies = movies;
    }

    public List<UserMovie> getMovies() {
        return movies;
    }
}
