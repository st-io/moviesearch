package com.webapp.moviesearch;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "active_sessions")
public class ActiveSession implements Serializable {
    @Column(name = "user_id")
    private String userId;
    @Id
    @Column(name = "session_id")
    private int sessionId;

    public ActiveSession() {}

    public ActiveSession(User user) {
        this.userId = user.getId();
        this.sessionId = Objects.hash(user.hashCode(), System.currentTimeMillis());
    }

    public String getUserId() {
        return userId;
    }

    public int getSessionId() {
        return sessionId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;
        if(!(o instanceof ActiveSession))
            return false;
        ActiveSession session = (ActiveSession) o;
        return Objects.equals(this.userId, session.userId) && Objects.equals(this.sessionId, session.sessionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.userId, this.sessionId);
    }

    @Override
    public String toString() {
        return "ActiveSession{" + "userId='" + this.userId + '\'' + ", sessionId='" + this.sessionId + '\'' + '}';
    }
}
