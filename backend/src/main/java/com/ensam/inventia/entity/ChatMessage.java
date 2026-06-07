package com.ensam.inventia.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="chat_messages")
public class ChatMessage {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    private Team team;

    @ManyToOne(optional=false)
    private User sender;

    @Column(nullable=false, length=1000)
    private String content;

    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
