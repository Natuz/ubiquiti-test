export const parseJwt = (token: string) => {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => `%${ (`00${ c.charCodeAt(0).toString(16) }`).slice(-2) }`)
            .join('')
    );

    return JSON.parse(payload);
};
