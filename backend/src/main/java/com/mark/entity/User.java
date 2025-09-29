package com.mark.entity;

import com.mark.constant.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String userid;

    @Column(nullable = false, length = 60)
    private String password;

    @Column(nullable=false, length=50)
    private String username;

    @Column(nullable = false, unique = true, length = 13)
    private String phone;

    @Column(unique = true, nullable=false, length=120)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
