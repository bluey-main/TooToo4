
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  imageUrls: { url: string }[];
  price: string;
  category: string;
  discountRate: number;
  discountedPrice: string;
}

interface RelatedProductsProps {
  category: string;
  id: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, id }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category)
      .neq("id", id)
      .limit(4);
    if (error) {
      console.log(error);
    } else {
      setProducts(data as Product[]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, id]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Related Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.imageUrls}
              price={product.price}
              category={product.category}
              isSpecialOffer={product.discountRate !== 0 ? true : false}
              discount={product.discountRate.toString()}
              slashedPrice={product.discountedPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
