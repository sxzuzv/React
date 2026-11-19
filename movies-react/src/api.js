import { TMDB_TOKEN } from "./config.js";


export default async function tmdb(path) {
    const res = await fetch(
        `https://api.themoviedb.org/3${path}`,
        { headers: { Authorization: `Bearer ${TMDB_TOKEN}` }}
    );

    if (!res.ok) {
        throw new Error('문제가 발생했습니다.');
    }

    return await res.json();
}