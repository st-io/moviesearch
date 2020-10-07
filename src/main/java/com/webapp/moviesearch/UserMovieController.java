package com.webapp.moviesearch;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserMovieController {
    private final UserRepository userRepository;
    private final UserMovieRepository movieRepository;
    private final ActiveSessionRepository sessionRepository;

    public UserMovieController(UserRepository userRepository, UserMovieRepository movieRepository, ActiveSessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.sessionRepository = sessionRepository;
    }

    @GetMapping("/user/{id}/bookmark/{imdbId}")
    public UserMovie saveMovie(@PathVariable String id, @PathVariable String imdbId) {
        System.out.print("New bookmark save");
        List<ActiveSession> result = sessionRepository.findByUserId(id);
        if(result.size() != 0) {
            Optional<User> userResult = userRepository.findById(id);
            User user = userResult.get();

            List<UserMovie> bookmarks = movieRepository.findAllByImdbId(imdbId);
            for(UserMovie b : bookmarks) {
                if (b.getUser().equals(id)) {
                    return new UserMovie("exists", id);
                }
            }
            UserMovie um = new UserMovie(imdbId, id);
            movieRepository.saveAndFlush(um);
            return um;
        }
        return new UserMovie();
    }

    @GetMapping("/user/{id}/bookmarks")
    public GetUserMovies getMovies(@PathVariable String id) {
        return new GetUserMovies(movieRepository.findByUserId(id));
    }

}
