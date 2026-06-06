package com.ensam.inventia.repository;
import com.ensam.inventia.entity.Submission; 
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface SubmissionRepository extends JpaRepository<Submission, Long> { 
  Optional<Submission> findByTeamId(Long teamId);
}
