package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.backend.entity.GuestBook;

import java.time.format.DateTimeFormatter;

/**
 * 방명록 응답 dto
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuestBookResponseDTO {
    private String id;
    private String nickName;
    private String content;
    private String createdAt;

    public static GuestBookResponseDTO fromEntity(GuestBook guestBook) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return GuestBookResponseDTO.builder()
                .id(String.valueOf(guestBook.getId()))
                .nickName(guestBook.getNickName())
                .content(guestBook.getContent())
                .createdAt(guestBook.getCreateAt().format(formatter))
                .build();
    }
}
