package org.example.backend.controller;

import org.example.backend.dto.GuestBookRequestDTO;
import org.example.backend.dto.GuestBookResponseDTO;
import org.example.backend.service.GuestBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/guestbooks")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}") // 기본은 로컬, 배포 시 환경변수로 변경
public class GuestController {
    private final GuestBookService guestBookService;

    /**
     * 조회 (GET)
     * URL: /api/guestbooks
     * Response: [{ id, nickName, content, createdAt }, ...]
     */
    @GetMapping
    public ResponseEntity<List<GuestBookResponseDTO>> getGuestBooks() {
        List<GuestBookResponseDTO> guestBooks = guestBookService.getGuestBooks();
        return ResponseEntity.ok(guestBooks);
    }

    /**
     * 등록 (POST)
     * URL: /api/guestbooks
     * Request: { nickName, password, content }
     */
    @PostMapping
    public ResponseEntity<Void> addGuestBook(
        @RequestBody GuestBookRequestDTO requestDTO
    ) {
        guestBookService.addGuestBook(requestDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * 수정 (PUT)
     * URL: /api/guestbooks/{id}
     * Request: { nickName, password, content }
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateGuestBook(
        @PathVariable Long id, 
        @RequestBody GuestBookRequestDTO requestDTO
    ) {
        guestBookService.updateGuestBook(id, requestDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * 삭제 (DELETE)
     * URL: /api/guestbooks/{id}
     * Request Body: { password } (GuestBookRequestDTO 재사용)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuestBook(
        @PathVariable Long id,
        @RequestBody GuestBookRequestDTO requestDTO
    ) {
        guestBookService.deleteGuestBook(id, requestDTO.getPassword());
        return ResponseEntity.ok().build();
    }
}
