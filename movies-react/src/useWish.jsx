import { createContext, useContext, useState } from 'react';

const WishContext = createContext(null);

export function WishProvider({ children }) {
    const [ wishIds, setWishIds ] = useState([]);

    function toggleWish(id) {
        let next;

        if (wishIds.includes(id)) { 
            next = wishIds.filter(wishId => wishId !== id); // 해당 id만 뺀 새 배열
        } else {
            next = [...wishIds, id];    // 기존 목록 + 새 id
        }

        setWishIds(next);   // 계산한 다음 상태로 교체
    }

    return <WishContext value={{ wishIds, toggleWish }}>{ children }</WishContext>
}

export function useWish() {
    return useContext(WishContext);
}