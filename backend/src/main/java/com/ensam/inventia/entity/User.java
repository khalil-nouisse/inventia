package com.ensam.inventia.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, unique=true, length=50) private String username;
 @Column(nullable=false, unique=true) private String email;
 @Column(nullable=false) private String password;
 @Column(nullable=false) private String firstName; @Column(nullable=false) private String lastName;
 @Column(length=500) private String bio; @Builder.Default private Boolean enabled=true;
 private LocalDateTime createdAt; private LocalDateTime updatedAt;
 @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="role_id") private Role role;
 @OneToMany(mappedBy="user") @Builder.Default private List<TeamMember> memberships=new ArrayList<>();
 @OneToMany(mappedBy="judge") @Builder.Default private List<Score> scores=new ArrayList<>();
 @OneToMany(mappedBy="user") @Builder.Default private List<RefreshToken> refreshTokens=new ArrayList<>();
 @PrePersist void prePersist(){createdAt=LocalDateTime.now(); updatedAt=createdAt;} @PreUpdate void preUpdate(){updatedAt=LocalDateTime.now();}
}
