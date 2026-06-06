package com.ensam.inventia.repository;
import com.ensam.inventia.entity.User; 
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> { 
  Optional<User> findByEmail(String email);
  Optional<User> findByUsername(String username);
  boolean existsByEmail(String email);
  boolean existsByUsername(String username);
}
