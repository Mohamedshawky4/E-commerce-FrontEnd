"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import Button from "./Button";

interface Product {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  averageRating?: number;
  slug?: string;
  //categories is an array of objects
  categories?: { _id: string; name: string; slug: string }[];
}

const ProductCard = ({ product }: { product: Product }) => {
  
  const [error, setError] = useState(false);
  //there is still bad images handling to be done here
const imageUrl =
  product.images &&
  product.images[0] &&
  /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(product.images[0])
    ? product.images[0]
    : "/images/product.jpg";
  const finalPrice = product.discountedPrice ?? product.price;

  return (
    <Link href={`/products/${product.slug}`}
     className="group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200
      dark:border-gray-800 rounded-3xl hover:shadow-2xl overflow-hidden shadow-primary/20
       hover:-translate-y-1 transition-all">
      <div className="w-full relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        <Image src={error ? "/images/product.jpg" : imageUrl}  alt={product.name} fill onError={() => {setError(true);
        }}
         className="object-cover transition-transform duration-500 group-hover:scale-110"/>
      {product.discountPercent && (
        <span className=" absolute top-3 left-3 bg-red-400 text-foreground text-sm rounded-md font-semibold px-2 py-1">{`-${product.discountPercent}%`}</span>
      )}
      </div>
      <div className="flex flex-col grow p-4"> 
      {/* Product category */}
      <div className="mb-1">
        {product.categories?.map((category, index) => (
          <span key={index} className="text-xs text-gray-500 dark:text-gray-400 mr-2 p-1">
            {category.name}
          </span>
        ))}
      </div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
        {product.name}
      </h2>

      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
        <Star size={14} fill="currentColor" />
        <span className="text-gray-600 dark:text-gray-300">
          {product.averageRating ?? 0} / 5
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
           {product.discountPercent ? (
             <>
               <span className="text-gray-400 line-through text-sm">
                 ${product.price}
               </span>
               <span className="text-primary font-bold">${finalPrice}</span>
             </>
           ) : (
             <span className="text-primary font-bold">${product.price}</span>
           )}
         </div>

         {/* Buttons row */}
        <div className="flex items-center justify-between mt-3">
          {/* i want to make this button responsive size md and in small screen size sm  */}
          <Button variant="primary" size="md" className="text-xs lg:text-base">
            Add to Cart
          </Button>
          <button
            onClick={(e) => e.preventDefault()}
            className=" hover:text-red-500 transition  text-lg"
          >
            <Heart />
          </button>
        </div>

      </div>
    
    </Link>
  );
};

export default ProductCard;
//  <Link
//       href={`/products/${product._id}`}
//       className="group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl hover:shadow-2xl overflow-hidden shadow-primary/20 hover:-translate-y-1 transition-all"
//     >
//       {/* Product image */}
//       <div className="relative w-full aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
//         <Image
//           src="/images/product.jpg"
//           alt={product.name}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-110"
//         />

//         {product.discountPercent && (
//           <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
//             -{product.discountPercent}%
//           </span>
//         )}
//       </div>

//       {/* Product details */}
//       <div className="flex flex-col flex-grow p-4">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
//           {product.name}
//         </h2>

//         <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
//           <Star size={14} fill="currentColor" />
//           <span className="text-gray-600 dark:text-gray-300">
//             {product.averageRating ?? 0} / 5
//           </span>
//         </div>

//         <div className="flex items-center gap-2 mt-2">
//           {product.discountPercent ? (
//             <>
//               <span className="text-gray-400 line-through text-sm">
//                 ${product.price}
//               </span>
//               <span className="text-primary font-bold">${finalPrice}</span>
//             </>
//           ) : (
//             <span className="text-primary font-bold">${product.price}</span>
//           )}
//         </div>

        // {/* Buttons row */}
        // <div className="flex items-center justify-between mt-3">
        //   <Button variant="primary">
        //     Add to Cart
        //   </Button>
        //   <button
        //     onClick={(e) => e.preventDefault()}
        //     className=" hover:text-red-500 transition  text-lg"
        //   >
        //     <Heart />
        //   </button>
        // </div>
//       </div>
//     </Link>
