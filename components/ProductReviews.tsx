"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, Plus, Loader2, User, Image as ImageIcon, Video, X, ShieldCheck } from "lucide-react";
import { useProductReviews, useAddReview, useToggleLikeReview } from "@/hooks/useReviews";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";
import Button from "./Button";
import Input from "./Input";
import { toast } from "sonner";

interface ProductReviewsProps {
    productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const { data: reviews = [], isLoading } = useProductReviews(productId);
    const { mutate: addReview, isPending: isAdding } = useAddReview();
    const { mutate: toggleLike } = useToggleLikeReview();
    const { email: userEmail, token } = useAuthStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (mediaFiles.length + files.length > 5) {
                toast.error("Max 5 files allowed.");
                return;
            }
            setMediaFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Please login to submit a review.");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a comment.");
            return;
        }

        setIsUploading(true);
        let uploadedImages: string[] = [];
        let uploadedVideos: string[] = [];

        try {
            if (mediaFiles.length > 0) {
                const formData = new FormData();
                mediaFiles.forEach(file => formData.append("media", file));
                const { data } = await api.post("/upload-review", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                if (data.success) {
                    data.urls.forEach((url: string) => {
                        if (url.match(/\.(mp4|webm|mov)$/i)) {
                            uploadedVideos.push(url);
                        } else {
                            uploadedImages.push(url);
                        }
                    });
                }
            }

            addReview(
                {
                    product: productId,
                    rating,
                    comment,
                    images: uploadedImages,
                    videos: uploadedVideos
                },
                {
                    onSuccess: () => {
                        toast.success("Review synchronized to the nexus.");
                        setIsFormOpen(false);
                        setComment("");
                        setRating(5);
                        setMediaFiles([]);
                    },
                    onError: (error: any) => {
                        toast.error(error.response?.data?.message || "Failed to submit review.");
                    }
                }
            );
        } catch (error) {
            toast.error("Media upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <section className="space-y-12 py-16 border-t border-border/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                        <MessageSquare size={14} className="text-primary" />
                        <span>Intelligence Feedback</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-metal tracking-tighter uppercase">
                        PRODUCT<span className="text-primary text-glow">REVIEWS</span>
                    </h2>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-4xl font-black text-white leading-none mb-2">{averageRating}</p>
                        <div className="flex gap-0.5 text-yellow-500 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{reviews.length} Feedbacks</p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        leftIcon={isFormOpen ? undefined : <Plus size={18} />}
                    >
                        {isFormOpen ? "CLOSE FORM" : "WRITE REVIEW"}
                    </Button>
                </div>
            </div>

            {/* Review Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="glass-card p-8 border-primary/20 bg-primary/5 space-y-6 rounded-4xl"
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">Select Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${star <= rating ? "bg-yellow-500 text-black scale-110" : "bg-white/5 text-foreground/30 hover:bg-white/10"
                                                    }`}
                                            >
                                                <Star size={20} fill={star <= rating ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <label className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">Your Experience</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Draft your feedback transmission..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-all font-medium min-h-[120px]"
                                    />

                                    {/* Media Upload */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[10px] font-black tracking-widest uppercase text-foreground/60">
                                                <ImageIcon size={14} />
                                                <span>Add Media</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*,video/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <span className="text-[9px] text-foreground/30 font-bold uppercase">{mediaFiles.length} / 5 FILES SELECED</span>
                                        </div>

                                        {mediaFiles.length > 0 && (
                                            <div className="flex flex-wrap gap-3">
                                                {mediaFiles.map((file, idx) => (
                                                    <div key={idx} className="relative w-20 h-20 rounded-xl border border-white/10 overflow-hidden bg-black/20 group">
                                                        {file.type.startsWith('image/') ? (
                                                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Video size={24} className="text-primary" />
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="liquid"
                                    isLoading={isAdding || isUploading}
                                    className="px-12"
                                >
                                    SUBMIT FEEDBACK
                                </Button>
                            </div>
                        </form>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <Loader2 size={40} className="text-primary animate-spin" />
                        <p className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Decrypting Feedbacks...</p>
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review, i) => (
                        <m.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-6 md:p-8 border-white/5 bg-white/2 hover:bg-white/3 transition-all rounded-4xl flex flex-col md:flex-row gap-6 md:gap-10"
                        >
                            {/* User Info */}
                            <div className="md:w-48 shrink-0 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {review.user?.avatar ? (
                                            <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} className="text-foreground/20" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-sm truncate max-w-[120px]">{review.user?.name || "Anonymous User"}</h4>
                                            {review.isVerifiedPurchase && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20" title="Verified Purchase">
                                                    <ShieldCheck size={10} />
                                                    <span className="text-[8px] font-black uppercase tracking-tighter">Verified</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-wider">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-0.5 text-yellow-500/80">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </div>

                            {/* Comment & Gallery */}
                            <div className="flex-1 space-y-5">
                                <p className="text-foreground/70 leading-relaxed font-medium">
                                    "{review.comment}"
                                </p>

                                {/* Review Media Gallery */}
                                {(review.images?.length || 0) + (review.videos?.length || 0) > 0 && (
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {review.images?.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer group">
                                                <img src={img} alt="Review" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                        ))}
                                        {review.videos?.map((video, idx) => (
                                            <div key={idx} className="relative w-40 aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/40 group">
                                                <video src={video} className="w-full h-full object-cover" controls />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => toggleLike(review._id)}
                                        className="flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground/40 hover:text-primary transition-colors uppercase group"
                                    >
                                        <ThumbsUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                        <span>Helpful ({review.likes?.length || 0})</span>
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/1 rounded-[2.5rem] border border-dashed border-white/5">
                        <MessageSquare size={48} className="text-foreground/10 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-foreground/40 uppercase mb-2">No intelligence recorded</h3>
                        <p className="text-sm text-foreground/20 max-w-xs mx-auto">Be the first to provide feedback on this neural asset.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductReviews;
