export interface Address {
    _id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    addresses: Address[];
    role: 'user' | 'admin';
}
