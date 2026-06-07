package com.ensam.inventia.repository;

import com.ensam.inventia.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByTeamIdOrderByCreatedAtAsc(Long teamId);
}
