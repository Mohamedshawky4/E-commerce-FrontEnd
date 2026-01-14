import { Metadata } from 'next';
import api from '@/lib/axios'; // This might not work in server components if it uses axios with interceptors that depend on browser state.
// Better use native fetch or a server-safe axios instance.

async function getProduct(id: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:5000/api';
        const res = await fetch(`${baseUrl}/products/${id}`, {
            next: { revalidate: 3600 },
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.product;
    } catch (error) {
        console.error('Metadata fetch error:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = await getProduct(params.id);

    if (!product) {
        return {
            title: 'Product Not Found | SPECTRA',
        };
    }

    const imageUrl = product.images?.[0] || '/logo-Photoroom.png';

    return {
        title: `${product.name} | SPECTRA`,
        description: product.description,
        openGraph: {
            title: `${product.name} | SPECTRA`,
            description: product.description,
            images: [{ url: imageUrl }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} | SPECTRA`,
            description: product.description,
            images: [imageUrl],
        },
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
