package com.ensam.inventia.repository;
import com.ensam.inventia.entity.RefreshToken; 
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> { 
  Optional<RefreshToken> findByToken(String token);
}
