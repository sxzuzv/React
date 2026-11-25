export const SERVER_URL = 'http://localhost:8000';

export async function api(path, options) {
    const res = await fetch(`${SERVER_URL}${path}`, options);

    if (!res.ok) {
        const data = await res.json();

        const error = new Error(data.detail);
        error.status = res.status;

        throw error;
    }

    if (res.status === 204) return null;

    return await res.json();
}