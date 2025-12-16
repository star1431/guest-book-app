package org.example.backend.repository;

import org.example.backend.entity.GuestBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 방멱록 레파지토리
 * @author 정병천
 * @since 2025-12-16
 */
@Repository
public interface GuestBookRepository extends JpaRepository<GuestBook, Long> {
}
