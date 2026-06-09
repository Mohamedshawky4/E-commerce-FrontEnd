"use client";
import React, { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { MapPin, Check, Plus, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import Input from "@/components/Input";
import { Address } from "@/types/user";

interface ShippingData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingStepProps {
  shippingData: ShippingData;
  setShippingData: (data: ShippingData) => void;
  addresses: Address[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  onNext: () => void;
}

const ShippingStep: React.FC<ShippingStepProps> = ({
  shippingData,
  setShippingData,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onNext,
}) => {
  const [showManualForm, setShowManualForm] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);

  // Auto-show form if no saved addresses
  useEffect(() => {
    if (addresses.length === 0) setShowManualForm(true);
  }, [addresses]);

  // Auto-select default address on mount
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
      setShippingData({
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country,
      });
    }
  }, [addresses]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr._id);
    setShippingData({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });
    setShowManualForm(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Partial<ShippingData> = {};
    if (!shippingData.street.trim()) newErrors.street = "Street address is required";
    if (!shippingData.city.trim()) newErrors.city = "City is required";
    if (!shippingData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!shippingData.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setSubmitted(true);
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onNext();
  };

  const handleFieldChange = (field: keyof ShippingData, value: string) => {
    setShippingData({ ...shippingData, [field]: value });
    if (submitted && errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">
          Shipping Address
        </h2>
        <p className="text-sm text-foreground/40">Where should we deliver your order?</p>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-foreground/60">
              Saved Addresses
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr._id;
              return (
                <m.button
                  key={addr._id}
                  onClick={() => handleSelectAddress(addr)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`relative p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/8"
                      : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {/* Selected indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <m.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check size={11} className="text-background" strokeWidth={3} />
                      </m.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        addr.isDefault
                          ? "bg-primary/15 text-primary"
                          : "bg-white/8 text-foreground/40"
                      }`}
                    >
                      {addr.isDefault ? "Default" : "Saved"}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground truncate">{addr.street}</p>
                  <p className="text-xs text-foreground/40 mt-0.5">
                    {addr.city}, {addr.postalCode}
                  </p>
                  <p className="text-xs text-foreground/30">{addr.country}</p>
                </m.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle Manual Form */}
      <div>
        <button
          onClick={() => {
            setShowManualForm((prev) => !prev);
            if (showManualForm) {
              // switching back to saved: reselect first if available
              if (addresses.length > 0 && !selectedAddressId) {
                handleSelectAddress(addresses[0]);
              }
            } else {
              setSelectedAddressId(null);
            }
          }}
          className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-primary hover:text-primary/70 transition-colors"
        >
          <Plus size={14} strokeWidth={3} />
          {showManualForm ? "Use Saved Address" : addresses.length > 0 ? "Enter Different Address" : "Enter Address Manually"}
          {showManualForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Manual Address Form */}
      <AnimatePresence>
        {showManualForm && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <m.div
              animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
              className="space-y-4 pt-2 rounded-2xl"
            >
              <Input
                label="Street Address *"
                placeholder="123 Main Street, Apt 4B"
                value={shippingData.street}
                onChange={(e) => handleFieldChange("street", e.target.value)}
                error={errors.street}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City *"
                  placeholder="Cairo"
                  value={shippingData.city}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  error={errors.city}
                />
                <Input
                  label="State / Region"
                  placeholder="Giza"
                  value={shippingData.state}
                  onChange={(e) => handleFieldChange("state", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Postal Code *"
                  placeholder="11511"
                  value={shippingData.postalCode}
                  onChange={(e) => handleFieldChange("postalCode", e.target.value)}
                  error={errors.postalCode}
                />
                <Input
                  label="Country *"
                  placeholder="Egypt"
                  value={shippingData.country}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  error={errors.country}
                />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Validation summary if submitted with errors */}
      <AnimatePresence>
        {submitted && Object.keys(errors).length > 0 && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-400 font-medium">
              Please fill in all required address fields before continuing.
            </p>
          </m.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <m.button
        onClick={handleNext}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-primary text-background font-black text-sm tracking-widest uppercase
          shadow-[0_0_25px_rgba(14,165,233,0.25)] hover:shadow-[0_0_35px_rgba(14,165,233,0.4)]
          dark:shadow-[0_0_25px_rgba(0,242,255,0.2)] dark:hover:shadow-[0_0_35px_rgba(0,242,255,0.4)]
          transition-all duration-300"
      >
        Continue to Payment →
      </m.button>
    </m.div>
  );
};

export default ShippingStep;
