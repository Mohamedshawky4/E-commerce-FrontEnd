export const SEO_CONFIG = {
    title: "SPECTRA | Premium Tech & Lifestyle Nexus",
    description: "Exhibition of elite technology, premium apparel, and industrial-grade lifestyle essentials. Experience the nexus of luxury and utility.",
    siteName: "SPECTRA",
    url: "https://spectra.tech", // Placeholder
    twitterHandle: "@spectra_tech",
};

export const DEFAULT_METADATA = {
    title: {
        default: SEO_CONFIG.title,
        template: `%s | ${SEO_CONFIG.siteName}`,
    },
    description: SEO_CONFIG.description,
    keywords: ["tech", "premium", "luxury", "industrial", "apparel", "gadgets", "spectra"],
    authors: [{ name: "SPECTRA Team" }],
    creator: "SPECTRA",
    publisher: "SPECTRA",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SEO_CONFIG.url,
        title: SEO_CONFIG.title,
        description: SEO_CONFIG.description,
        siteName: SEO_CONFIG.siteName,
        images: [
            {
                url: "/og-image.jpg", // Placeholder
                width: 1200,
                height: 630,
                alt: SEO_CONFIG.title,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SEO_CONFIG.title,
        description: SEO_CONFIG.description,
        creator: SEO_CONFIG.twitterHandle,
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
    },
};
