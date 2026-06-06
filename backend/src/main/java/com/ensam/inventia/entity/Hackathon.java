package com.ensam.inventia.entity;
import com.ensam.inventia.enums.HackathonStatus; import jakarta.persistence.*; import lombok.*; import java.time.*; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="hackathons")
public class Hackathon {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, length=150) private String title; @Column(nullable=false, length=2000) private String description;
 @Column(length=200) private String theme; @Column(length=500) private String prize;
 private LocalDate registrationDeadline; private LocalDate startDate; private LocalDate endDate; private Integer maxTeamSize;
 @Enumerated(EnumType.STRING) private HackathonStatus status; private LocalDateTime createdAt; private LocalDateTime updatedAt;
 @ManyToOne(optional=false) private User createdBy; @OneToMany(mappedBy="hackathon", cascade=CascadeType.ALL) @Builder.Default private List<Team> teams=new ArrayList<>();
 @PrePersist void prePersist(){createdAt=LocalDateTime.now(); updatedAt=createdAt; computeStatus();} @PreUpdate void preUpdate(){updatedAt=LocalDateTime.now(); computeStatus();}
 public void computeStatus(){ LocalDate today=LocalDate.now(); status=today.isBefore(startDate)?HackathonStatus.UPCOMING:(today.isAfter(endDate)?HackathonStatus.ENDED:HackathonStatus.ONGOING); }
}
