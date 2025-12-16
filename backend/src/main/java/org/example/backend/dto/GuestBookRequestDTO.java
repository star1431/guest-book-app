package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 방명록 요청 dto
 * @author 정병천
 * @since 2025-12-16
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestBookRequestDTO {
    private String nickName;
    private String password;
    private String content;
}
