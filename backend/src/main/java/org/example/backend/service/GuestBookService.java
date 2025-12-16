package org.example.backend.service;

import lombok.RequiredArgsConstructor;

import org.example.backend.dto.GuestBookRequestDTO;
import org.example.backend.dto.GuestBookResponseDTO;
import org.example.backend.entity.GuestBook;
import org.example.backend.repository.GuestBookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 방멱록 서비스
 * @author 정병천
 * @since 2025-12-16
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuestBookService {
    private final GuestBookRepository guestBookRepository;


    /** 조회 */
    public List<GuestBookResponseDTO> getGuestBooks() {

        List<GuestBook> guestBooks = guestBookRepository.findAll();
        
        return guestBooks.stream()
                .map(GuestBookResponseDTO::fromEntity)
                .collect(Collectors.toList());
                
    }

    /** 등록 */
    @Transactional
    public void addGuestBook(GuestBookRequestDTO requestDTO) {

        GuestBook guestBook = GuestBook.builder()
                .nickName(requestDTO.getNickName())
                .password(requestDTO.getPassword())
                .content(requestDTO.getContent())
                .createAt(LocalDateTime.now())
                .build();

        guestBookRepository.save(guestBook);
    }

    /** 수정 */
    @Transactional
    public void updateGuestBook(Long id, GuestBookRequestDTO requestDTO) {

        GuestBook guestBook = guestBookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("해당 방명록 못찾음 ::" + id));
        
        if (!guestBook.getPassword().equals(requestDTO.getPassword())) {
            throw new RuntimeException("비밀번호 불일치 :: " + requestDTO.getPassword());
        } else {
            guestBook.setNickName(requestDTO.getNickName());
            guestBook.setContent(requestDTO.getContent());
            guestBookRepository.save(guestBook);
        }
    }

    /** 삭제 */
    @Transactional
    public void deleteGuestBook(Long id, String password) {
    
        GuestBook guestBook = guestBookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("해당 방명록 못찾음 ::" + id));
        
        if (!guestBook.getPassword().equals(password)) {
            throw new RuntimeException("비밀번호 불일치 :: " + password);
        } else {
            guestBookRepository.delete(guestBook);
        }
    }

}
