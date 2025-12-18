# API 명세서

## 1. 방명록 전체 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/guestbooks` |
| **Request** | 없음 |
| **Response** | `200 OK`<br>`[{ id, nickName, content, createdAt }, ...]` |

---

## 2. 방명록 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/guestbooks` |
| **Request** | `{ nickName, password, content }` |
| **Response** | `200 OK` (body 없음) |

---

## 3. 방명록 수정

| 항목 | 내용 |
|------|------|
| **Method** | `PUT` |
| **URL** | `/api/guestbooks/{id}` |
| **Request** | `{ nickName, password, content }` (Path Variable: id) |
| **Response** | `200 OK` (body 없음) |

---

## 4. 방명록 삭제

| 항목 | 내용 |
|------|------|
| **Method** | `DELETE` |
| **URL** | `/api/guestbooks/{id}` |
| **Request** | `{ password }` (GuestBookRequestDTO 재사용) |
| **Response** | `200 OK` (body 없음) |

---

## 데이터 타입

### GuestBookRequestDTO

```json
{
  "nickName": "string (필수, 최대 50자)",
  "password": "string (필수)",
  "content": "string (필수, 최대 500자)"
}
```

### GuestBookResponseDTO

```json
{
  "id": "string",
  "nickName": "string",
  "content": "string",
  "createdAt": "string (yyyy-MM-dd HH:mm:ss 형식)"
}
```

**참고**: 삭제 API는 `GuestBookRequestDTO`의 `password` 필드만 사용
