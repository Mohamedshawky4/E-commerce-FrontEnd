import { Category } from '@/types/category'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex flex-col justify-between items-center text-center hover:-translate-y-1 transition-all"
    >
      <div className="w-36 h-36 rounded-full overflow-hidden bg-background-secondary dark:bg-background-dark flex items-center justify-center">
        <Image
          src={category.image}
          alt={category.name}
          width={120}
          height={120}
          className="object-contain w-3/4 h-3/4 transition-transform duration-300 hover:scale-110"
        />
      </div>

      <h3 className="text-md font-semibold mt-2">{category.name}</h3>
    </Link>
  )
}

export default CategoryCard
