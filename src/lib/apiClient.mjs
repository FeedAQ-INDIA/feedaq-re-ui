// apiClient.mjs

// lib/apiClient.ts
export async function apiClient(endpoint, options = {}) {
    const res = await fetch(endpoint, {
        ...options,
        credentials: "include", // This sends HTTP-only cookies
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });


    // Optional: refresh logic on 401/403
    if (res.status === 401 || res.status === 403) {
        // Try refresh
        const refresh = await fetch("http://localhost:8080/auth/refresh-token", {
            method: "POST",
            credentials: "include",
        });

        if (refresh.ok) {
            // Retry original request
            return await apiClient(endpoint, options);
        } else {
            // Redirect to login
            console.log(!isPublicPage(window.location.pathname))
            if (!isPublicPage(window.location.pathname)) {

                window.location = "/signin" + getRedirectUri();
                console.log("redirecting to login")
            }
        }
    }

    return res;
}

const getRedirectUri = () => {
    return "?redirectUri=" + window.location.href;
}

const publicPatterns = [
    /^\/$/,                 // exact "/"
    /^\/signin$/,           // exact "/signin"
    /^\/property(\/.*)?$/,  // "/property" and subpaths
    /^\/search(\/.*)?$/,    // "/search" and subpaths
];

const isPublicPage = (pathname) => {
    return publicPatterns.some(pattern => pattern.test(pathname));
};
