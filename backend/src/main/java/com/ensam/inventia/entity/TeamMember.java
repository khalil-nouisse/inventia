package com.ensam.inventia.entity;
import com.ensam.inventia.enums.TeamMemberRole; import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="team_members", uniqueConstraints=@UniqueConstraint(columnNames={"team_id","user_id"}))
public class TeamMember { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(optional=false) private Team team; @ManyToOne(optional=false) private User user; @Enumerated(EnumType.STRING) private TeamMemberRole memberRole; private LocalDateTime joinedAt; @PrePersist void prePersist(){joinedAt=LocalDateTime.now();} }
