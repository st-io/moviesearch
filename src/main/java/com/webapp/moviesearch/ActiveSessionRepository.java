package com.webapp.moviesearch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActiveSessionRepository extends JpaRepository<ActiveSession, Integer> {
    public List<ActiveSession> findByUserId(String userId);
}