package com.ensam.inventia.repository;
import com.ensam.inventia.entity.Team; 
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface TeamRepository extends JpaRepository<Team, Long> { 
}
