import type { PageServerLoad } from './$types';
import type { PageData, Feature } from '$lib/types';

const features: Feature[] = [
    {
        title: "IP Monitoring",
        description: "Real-time monitoring of your intellectual property across digital platforms"
    },
    {
        title: "Automated Protection",
        description: "Automated detection and response to potential IP infringements"
    },
    {
        title: "Analytics Dashboard",
        description: "Comprehensive analytics and reporting for your IP portfolio"
    },
    {
        title: "Global Coverage",
        description: "Worldwide IP monitoring and protection services"
    }
];

export const load = (async ({ setHeaders }) => {
    const data = {
        features: features.map(f => ({ ...f })),
        meta: {
            title: "JanusIPM",
            description: "Advanced intellectual property management and protection services"
        }
    } satisfies PageData;

    setHeaders({
        'cache-control': 'no-cache, no-store, must-revalidate'
    });

    return data;
}) satisfies PageServerLoad;