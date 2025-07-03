// apiClient.js

export async function apiClient(endpoint, options = {}, pathname = "/") {
    const res = await fetch(endpoint, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    // Handle auth failures
    if (res.status === 401 || res.status === 403) {
        const refresh = await fetch("http://localhost:8080/auth/refresh-token", {
            method: "POST",
            credentials: "include",
        });

        if (refresh.ok) {
            // Retry original request
            return await apiClient(endpoint, options, pathname);
        } else {
            // Redirect only on client side
            if (typeof window !== "undefined" && !isPublicPage(pathname)) {
                window.location.href = "/signin" + getRedirectUri();
            }
        }
    }

    return res;
}

// Builds redirect URI from current location (CSR only)
const getRedirectUri = () => {
    if (typeof window !== "undefined") {
        return "?redirectUri=" + encodeURIComponent(window.location.href);
    }
    return "";
};

// Define publicly accessible paths
const publicPatterns = [
    /^\/$/,                 // "/"
    /^\/signin$/,           // "/signin"
    /^\/property(\/.*)?$/,  // "/property" and subpaths
    /^\/buy(\/.*)?$/,    // "/search" and subpaths
    /^\/plot-land(\/.*)?$/,    // "/search" and subpaths
    /^\/buy(\/.*)?$/,    // "/search" and subpaths
    /^\/consultant(\/.*)?$/,    // "/search" and subpaths
    /^\/project(\/.*)?$/,    // "/search" and subpaths
    /^\/pg-colive(\/.*)?$/,    // "/search" and subpaths
];

// Check if a path is public
const isPublicPage = (pathname) => {
    return publicPatterns.some(pattern => pattern.test(pathname));
};
