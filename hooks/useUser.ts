import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User, Address } from "@/types/user";

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const response = await api.get("/users/profile");
            return response.data as User;
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<User>) => {
            const response = await api.put("/users/profile", data);
            return response.data.user;
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["userProfile"], updatedUser);
        },
    });
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);

            const response = await api.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data; // Should be the path string
        },
    });
};

// This just updates the avatar field on the user model using the URL
export const useUpdateAvatarUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (avatarUrl: string) => {
            const response = await api.post("/users/upload-avatar", { avatar: avatarUrl });
            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["userProfile"], user);
        }
    });
}

export const useUserAddresses = () => {
    return useQuery({
        queryKey: ["userAddresses"],
        queryFn: async () => {
            const response = await api.get("/users/addresses");
            return response.data as Address[];
        },
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (address: Omit<Address, "_id">) => {
            const response = await api.post("/users/address", address);
            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
            // Update profile cache as well since it contains addresses
            queryClient.setQueryData(["userProfile"], user);
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, address }: { id: string; address: Partial<Address> }) => {
            const response = await api.put(`/users/address/${id}`, address);
            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
            queryClient.setQueryData(["userProfile"], user);
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/users/address/${id}`);
            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
            queryClient.setQueryData(["userProfile"], user);
        },
    });
};

export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.put(`/users/address/${id}/set-default`);
            return response.data.user;
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
            queryClient.setQueryData(["userProfile"], user);
        },
    });
}
