export const SERVER_URL = 'http://localhost:8000';

export async function api(path, options) {
    const res = await fetch(`${SERVER_URL}${path}`, options);

    if (!res.ok) {
        const data = await res.json();
        // { "detail" : "해당 게시물이 없습니다." }
        throw new Error(data.detail);
    }

    return await res.json();
}