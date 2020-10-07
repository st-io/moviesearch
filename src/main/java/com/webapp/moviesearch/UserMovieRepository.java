package com.webapp.moviesearch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
interface UserMovieRepository extends JpaRepository<UserMovie, Long> {
    List<UserMovie> findByUserId(String userId);
    List<UserMovie> findAllByImdbId(String imdbId);
}