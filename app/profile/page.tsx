"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import {
    User as UserIcon,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Check,
    Camera,
    Phone,
    Mail,
    Loader2
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
    useUserProfile,
    useUpdateProfile,
    useUploadImage,
    useUpdateAvatarUrl,
    useUserAddresses,
    useAddAddress,
    useUpdateAddress,
    useDeleteAddress,
    useSetDefaultAddress
} from "@/hooks/useUser";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/ui/Modal";
import AddressForm from "@/components/AddressForm";
import { Address } from "@/types/user";
import LazyBackground from "@/components/LazyBackground";

export default function ProfilePage() {
    const router = useRouter();
    const { initialized, token } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Queries
    const { data: user, isLoading: isUserLoading, error: userError } = useUserProfile();
    const { data: addresses, isLoading: isAddressesLoading } = useUserAddresses();

    // Mutations
    const updateProfileMutation = useUpdateProfile();
    const uploadImageMutation = useUploadImage();
    const updateAvatarUrlMutation = useUpdateAvatarUrl();
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();
    const setDefaultAddressMutation = useSetDefaultAddress();

    // State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Auth Check
    useEffect(() => {
        if (initialized && !token) {
            router.push("/login");
        }
    }, [initialized, token, router]);

    // Sync profile form
    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfileMutation.mutateAsync({
                name: profileForm.name,
                phone: profileForm.phone
            });
            setIsEditingProfile(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. Upload file
            const path = await uploadImageMutation.mutateAsync(file);
            // 2. Update user avatar URL (Assuming path is returned from upload)
            // We need to construct the full URL if the backend returns a relative path
            // And if the backend serves uploads.
            // Based on my implementation: `res.send('/' + req.file.path...)` -> returns e.g. `/uploads/filename.jpg`
            // So we can use it directly if using local server proxy or if BASE_URL is handled.
            // In production with separate backend, we might need full URL.
            // For now, assuming backend serves /uploads and we can prepend base URL, OR just store the relative path
            // and let the image component handle it.

            // Actually, let's prepend the API URL if it's relative, 
            // but typically we store relative path in DB.
            // But `Image` component needs full URL or relative to public.

            // Let's just save the path returned by backend.
            await updateAvatarUrlMutation.mutateAsync(path);

        } catch (error) {
            console.error("Failed to upload avatar", error);
        }
    };

    const handleAddressSubmit = async (data: any) => {
        try {
            if (editingAddress) {
                await updateAddressMutation.mutateAsync({ id: editingAddress._id, address: data });
            } else {
                await addAddressMutation.mutateAsync(data);
            }
            setIsAddressModalOpen(false);
            setEditingAddress(null);
        } catch (error) {
            console.error("Failed to save address", error);
        }
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this address?")) {
            await deleteAddressMutation.mutateAsync(id);
        }
    };

    const handleSetDefault = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await setDefaultAddressMutation.mutateAsync(id);
    };

    // Helper to format avatar URL
    const getAvatarUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // Assuming backend runs on same host or proxied?
        // If backend is on 5000 and frontend on 3000, we need the full URL.
        // I'll assume we need to prepend the backend URL.
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}${path}`;
    };


    if (!initialized || isUserLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (userError || !user) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black">
                <div className="text-center text-red-500">Failed to load profile. Please try logging in again.</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black selection:bg-blue-500/30">
            <div className="fixed inset-0 z-0">
                <LazyBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black z-10" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                        <UserIcon size={200} className="text-blue-500 blur-3xl" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div
                                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-black cursor-pointer shadow-xl group-hover:border-blue-500/50 transition-all duration-300"
                                onClick={handleAvatarClick}
                            >
                                {user.avatar ? (
                                    <img
                                        src={getAvatarUrl(user.avatar) || ''}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                                        <UserIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                            {uploadImageMutation.isPending && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Info Text */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {user.name}
                            </h1>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-blue-500" />
                                    <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-green-500" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}

                                {user.role === 'admin' && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            className="self-center md:self-start"
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                        >
                            <Edit2 size={16} className="mr-2" />
                            {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                        </Button>
                    </div>

                    {/* Edit Profile Form */}
                    <AnimatePresence>
                        {isEditingProfile && (
                            <m.form
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                onSubmit={handleProfileUpdate}
                                className="mt-8 pt-8 border-t border-white/10 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter your name"
                                    />
                                    <Input
                                        type="tel"
                                        label="Phone Number"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="submit"
                                        isLoading={updateProfileMutation.isPending}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </m.form>
                        )}
                    </AnimatePresence>
                </m.div>

                {/* Addresses Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MapPin className="text-blue-500" />
                            Address Book
                        </h2>
                        <Button onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}>
                            <Plus size={18} className="mr-2" />
                            Add Address
                        </Button>
                    </div>

                    {isAddressesLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : AddressesList(addresses, handleEditAddress, handleDeleteAddress, handleSetDefault, setDefaultAddressMutation.isPending)}
                </div>
            </div>

            <Modal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                title={editingAddress ? "Edit Address" : "Add New Address"}
            >
                <AddressForm
                    initialData={editingAddress}
                    onSubmit={handleAddressSubmit}
                    isLoading={addAddressMutation.isPending || updateAddressMutation.isPending}
                    onCancel={() => setIsAddressModalOpen(false)}
                />
            </Modal>

        </div>
    );
}

function AddressesList(
    addresses: Address[] | undefined,
    onEdit: (a: Address) => void,
    onDelete: (id: string, e: React.MouseEvent) => void,
    onSetDefault: (id: string, e: React.MouseEvent) => void,
    isSettingDefault: boolean
) {
    if (!addresses || addresses.length === 0) {
        return (
            <div className="text-center py-12 md:py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                <MapPin size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-white">No addresses found</h3>
                <p className="text-gray-400 mt-2">Add an address to speed up checkout.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
                <m.div
                    key={address._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative group bg-[#0a0a0a] border rounded-2xl p-6 transition-all duration-300 ${address.isDefault
                        ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                >
                    {address.isDefault && (
                        <div className="absolute top-4 right-4 text-blue-500">
                            <Check size={20} strokeWidth={3} />
                        </div>
                    )}

                    <div className="space-y-1 mb-6">
                        <div className="font-medium text-white text-lg">{address.street}</div>
                        <div className="text-gray-400">{address.city}, {address.state} {address.postalCode}</div>
                        <div className="text-gray-500 text-sm uppercase tracking-wider">{address.country}</div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <button
                            onClick={() => onEdit(address)}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <Edit2 size={14} />
                            Edit
                        </button>
                        <div className="h-4 w-px bg-white/10" />
                        <button
                            onClick={(e) => onDelete(address._id, e)}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>

                        {!address.isDefault && (
                            <button
                                onClick={(e) => onSetDefault(address._id, e)}
                                disabled={isSettingDefault}
                                className="ml-auto text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium disabled:opacity-50"
                            >
                                Set Default
                            </button>
                        )}
                    </div>
                </m.div>
            ))}
        </div>
    );
}

