import type { PageLoad } from './$types';

interface Feature {
    title: string;
    description: string;
    icon: string;
}

export const load: PageLoad = async () => {
    const features: Feature[] = [
        {
            title: 'IP Portfolio Management',
            description: 'Comprehensive management of patents, trademarks, and copyrights',
            icon: 'portfolio'
        },
        {
            title: 'Brand Protection',
            description: 'AI-powered monitoring and enforcement of intellectual property rights',
            icon: 'shield'
        },
        {
            title: 'Global Coverage',
            description: 'Worldwide intellectual property monitoring and protection',
            icon: 'globe'
        },
        {
            title: 'Real-time Alerts',
            description: 'Instant notifications of potential IP infringements',
            icon: 'bell'
        }
    ];

    return {
        features,
        meta: {
            title: 'BrandVigilante - IP Management Solutions',
            description: 'Advanced intellectual property management and protection services'
        }
    };
}; 