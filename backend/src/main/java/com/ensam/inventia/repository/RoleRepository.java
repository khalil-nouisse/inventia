package com.ensam.inventia.repository;
import com.ensam.inventia.entity.Role; import com.ensam.inventia.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor; import java.util.*;
public interface RoleRepository extends JpaRepository<Role, Long> { 
  Optional<Role> findByName(RoleEnum name);
}
