"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Address } from "@/types/user";

interface AddressFormProps {
    initialData?: Address | null;
    onSubmit: (data: any) => void;
    isLoading: boolean;
    onCancel: () => void;
}

export default function AddressForm({ initialData, onSubmit, isLoading, onCancel }: AddressFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                street: initialData.street,
                city: initialData.city,
                state: initialData.state,
                postalCode: initialData.postalCode,
                country: initialData.country,
                isDefault: initialData.isDefault,
            });
        } else {
            reset({
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
                isDefault: false,
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Street Address"
                {...register("street", { required: "Street is required" })}
                error={errors.street?.message as string}
                placeholder="123 Main St"
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="City"
                    {...register("city", { required: "City is required" })}
                    error={errors.city?.message as string}
                    placeholder="New York"
                />
                <Input
                    label="State / Province"
                    {...register("state")}
                    placeholder="NY"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Postal Code"
                    {...register("postalCode", { required: "Postal code is required" })}
                    error={errors.postalCode?.message as string}
                    placeholder="10001"
                />
                <Input
                    label="Country"
                    {...register("country", { required: "Country is required" })}
                    error={errors.country?.message as string}
                    placeholder="United States"
                />
            </div>

            <div className="flex items-center space-x-2 mt-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    {...register("isDefault")}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-black/50"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-300">Set as default address</label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <Button
                    variant="secondary"
                    onClick={(e) => { e.preventDefault(); onCancel(); }}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                >
                    {initialData ? "Update Address" : "Add Address"}
                </Button>
            </div>
        </form>
    );
}
