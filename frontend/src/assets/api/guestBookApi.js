const API_URL = 'http://localhost:8080/api/guestbooks';

/**
 * 방명록 전체 조회
 * @returns {Promise<Array<{id: string, nickName: string, content: string, createdAt: string}>>}
 * @throws {Error}
 * @example
 * const guestbooks = await getGuestBooks();
 */
export const getGuestBooks = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`[API] 방명록 조회 실패: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
};

/**
 * 방명록 등록
 * @param {{nickName: string, password: string, content: string}} guestbook
 * @returns {Promise<void>}
 * @throws {Error}
 * @example
 * await addGuestBook({ nickName: '홍길동', password: '1234', content: '방명록 내용' });
 */
export const addGuestBook = async (guestbook) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestbook),
    });
    
    if (!response.ok) {
        throw new Error(`[API] 방명록 등록 실패: ${response.status} ${response.statusText}`);
    }
    
    // ResponseEntity<Void>는 body가 없으므로 별도 처리 불필요
};

/**
 * 방명록 수정
 * @param {string|number} id - 방명록 ID
 * @param {{nickName: string, password: string, content: string}} guestbook
 * @returns {Promise<void>}
 * @throws {Error}
 * @example
 * await updateGuestBook(1, { nickName: '홍길동', password: '1234', content: '수정된 내용' });
 */
export const updateGuestBook = async (id, guestbook) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestbook),
    });
    
    if (!response.ok) {
        throw new Error(`[API] 방명록 수정 실패: ${response.status} ${response.statusText}`);
    }
    
    // ResponseEntity<Void>는 body가 없으므로 별도 처리 불필요
};

/**
 * 방명록 삭제
 * @param {string|number} id - 방명록 ID
 * @param {string} password - 비밀번호
 * @returns {Promise<void>}
 * @throws {Error}
 * @example
 * await deleteGuestBook(1, '1234');
 */
export const deleteGuestBook = async (id, password) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
        throw new Error(`[API] 방명록 삭제 실패: ${response.status} ${response.statusText}`);
    }
    
    // ResponseEntity<Void>는 body가 없으므로 별도 처리 불필요
};

