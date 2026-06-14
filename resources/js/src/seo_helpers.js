/**
 * SEO Helpers for generating Schema.org JSON-LD
 */

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "F16s E-Freight Solutions",
    "url": "https://f16sefreight.com",
    "logo": "https://f16sefreight.com/media/assets/logos/blue-logo.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "areaServed": "Global",
        "availableLanguage": "English"
    },
    "sameAs": [
        "https://www.linkedin.com/company/f16s-efreight-solutions",
        "https://twitter.com/f16sefreight"
    ]
};

export const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "F16s E-Freight Platform",
    "operatingSystem": "Web-based",
    "applicationCategory": "BusinessApplication",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "description": "Smart e-Freight Solutions for Freight Forwarders. Process MAWB and HAWB in seconds with 150+ airline connections."
};

export function getBlogPostingSchema(post, currentUrl) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": [post.image],
        "datePublished": post.date,
        "author": [{
            "@type": "Organization",
            "name": "F16s Editorial Team",
            "url": "https://f16sefreight.com"
        }],
        "description": post.excerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
        }
    };
}
