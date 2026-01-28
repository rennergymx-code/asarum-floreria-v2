import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Asarum Florería y Regalos: Arreglos florales premium, ramos y detalles para toda ocasión en Hermosillo y SLRC.",
    image = "/og-image.jpg",
    url = window.location.href
}) => {
    const fullTitle = title
        ? `${title} | Asarum Florería`
        : "Asarum Florería y Regalos | Flores a Domicilio en Hermosillo y SLRC";

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', fullTitle);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', image);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        // Update Twitter tags
        const twTitle = document.querySelector('meta[property="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', fullTitle);

        const twDescription = document.querySelector('meta[property="twitter:description"]');
        if (twDescription) twDescription.setAttribute('content', description);
    }, [fullTitle, description, image, url]);

    return null;
};

export default SEO;
