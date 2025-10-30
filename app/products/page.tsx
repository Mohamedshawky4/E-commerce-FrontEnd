"use client";
import ProductCard from '@/components/ProductCard';
import api from '@/lib/axios'
import React, { useEffect } from 'react'

const Page = () => {
    const [products, setProducts] = React.useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/products');
        const products=response.data.products
        setProducts(products);
        console.log(products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className='mt-10 '>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-16 py-24">
  {products.map((p) => (
    <ProductCard key={p._id} product={p} />
  ))}
</div>

    </div>

  )
}

export default Page