package com.ensam.inventia.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="teams")
public class Team {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false, length=100) private String name;
 @Column(length=500) private String description; private String techStack; private LocalDateTime createdAt; private LocalDateTime updatedAt;
 @ManyToOne(optional=false) private Hackathon hackathon; @OneToMany(mappedBy="team", cascade=CascadeType.ALL, orphanRemoval=true) @Builder.Default private List<TeamMember> members=new ArrayList<>();
 @OneToOne(mappedBy="team", cascade=CascadeType.ALL) private Submission submission;
 @PrePersist void prePersist(){createdAt=LocalDateTime.now(); updatedAt=createdAt;} @PreUpdate void preUpdate(){updatedAt=LocalDateTime.now();}
}
