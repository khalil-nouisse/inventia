package com.ensam.inventia.repository;
import com.ensam.inventia.entity.Score; 
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface ScoreRepository extends JpaRepository<Score, Long> { 
  boolean existsBySubmissionIdAndJudgeId(Long submissionId, Long judgeId);
  java.util.List<Score> findBySubmissionId(Long submissionId);
}
