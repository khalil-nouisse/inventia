package com.ensam.inventia.entity;
import com.ensam.inventia.enums.RoleEnum; import jakarta.persistence.*; import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity @Table(name="roles")
public class Role { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Enumerated(EnumType.STRING) @Column(nullable=false, unique=true) private RoleEnum name; }
