package com.mark.repository;

import com.mark.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserid(String userid);

    boolean existsByUserid(String userid);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

}
