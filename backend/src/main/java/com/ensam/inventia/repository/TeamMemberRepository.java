package com.ensam.inventia.repository;
import com.ensam.inventia.entity.TeamMember; 
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> { 
  boolean existsByUserIdAndTeamHackathonId(Long userId, Long hackathonId);
  Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
}
