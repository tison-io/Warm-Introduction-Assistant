import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
        url: 'https://warmly-intro-assistant.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
        },
    ]
}