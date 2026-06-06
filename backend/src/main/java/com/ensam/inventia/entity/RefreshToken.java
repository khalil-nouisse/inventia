package com.ensam.inventia.entity;
import jakarta.persistence.*; import lombok.*; import java.time.Instant;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="refresh_tokens")
public class RefreshToken { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false, unique=true) private String token; private Instant expiryDate; private Boolean revoked; @ManyToOne(optional=false) private User user; }
