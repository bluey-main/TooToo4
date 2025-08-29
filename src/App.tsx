import { useEffect, ReactNode } from "react";
import "./App.css";
import {
  BsArrowRight,
  BsTv
} from "react-icons/bs";
import {
  TbBrandAirtable,
  TbDeviceGamepad2,
  TbHanger,
} from "react-icons/tb";
import { CiApple, CiDumbbell } from "react-icons/ci";
import { Link } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { numberWithCommas } from "./utils/helper";
import { desktopPieChart, mobilePieChart, tabletPieChart, unknownPieChart } from "./utils/pieChartFunctions";
import CategoriesCard from "./components/CategoriesCard";
import ProductCard from "./components/ProductCard";
import ProductLoader from "./components/ProductLoader";

// Define the type for a single product
export interface IProduct {
  id: string;
  name: string;
  image_urls: { url: string , filename:string }[];
  category: string;
  price: number;
  tags: string[];
  length:number;
  width:number;
  height:number;
  weight:number;
  sku:string;
  discounted_price:number;
  discount_rate:number;
  other_info:string;
  stock_quantity:number;
  seller_id:string;
  category_id:string;
  description:string;
  created_at:string;
  updated_at:string;  
}

// Define the type for a single category
interface Category {
  category: string;
  icon: ReactNode;
}

function App() {
  
  const { allProducts, fetchingAllProducts } = useAuth() as { allProducts: IProduct[], fetchingAllProducts: boolean };




  useEffect(()=> {
    const screenWidth = window.innerWidth;
    if(screenWidth>=350 && screenWidth<=600){
      mobilePieChart()
    }else if( screenWidth>630 && screenWidth<=900){
      tabletPieChart()
    }else if( screenWidth>1000 && screenWidth<=1800){
      desktopPieChart()    
    }else{
      unknownPieChart()
    }
  },[])

  const categories: Category[] = [
    {
      category: "Fashion",
      icon: <TbHanger size={30} />,
    },
    {
      category: "Furniture",
      icon: <TbBrandAirtable size={30} />,
    },
    {
      category: "Electronics",
      icon: <BsTv size={30} />,
    },
    {
      category: "Gaming",
      icon: <TbDeviceGamepad2 size={30} />,
    },
    {
      category: "Sports",
      icon: <CiDumbbell size={30} />,
    },
    {
      category: "SuperMarket",
      icon: <CiApple size={30} />,
    },
  ];

  return (
    <section className="p-4 py-10">
      {/* Banners */}
      <div className="grid grid-cols-[70%_30%] max-lg:grid-cols-2 grid-rows-2 h-[350px] w-full gap-5 max-md:h-[300px] max-md:gap-2">
        <img
          src="https://bafybeicteimkajecwffgrjuyfvmfpi4dpk3bhrjh2iutu5rzongdpczlxm.ipfs.w3s.link/WhatsApp Image 2024-04-01 at 23.22.47_ab21b449.jpg"
          alt=""
          className="col-span-1 rounded-xl row-span-2 max-lg:col-span-2 max-lg:row-span-1 h-full object-cover w-full bg-black/10 border"
        />
        <img
          src="https://bafybeicppdthbgb3cmmhb2lqo63lyhh2zd7l6c2mcs2eaqbchwyirtyjo4.ipfs.w3s.link/WhatsApp Image 2024-04-01 at 23.22.47_ee6ea1a6.jpg"
          alt=""
          className="h-full rounded-xl object-cover w-full bg-black/10"
        />
        <img
          src="https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-l@3x.png"
          alt=""
          className="h-full rounded-xl object-cover w-full bg-black/10"
        />
      </div>

      {/* New Arrivals */}
      
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
          <Link className="text-[#086047]  flex items-center gap-2" to={
""}>
            <p className=" font-semibold">View More</p>
            <BsArrowRight />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-4 max-lg:flex flex-nowrap overflow-x-auto gap-x-4  gap-y-5 xl:gap-x-5 gap-3 rounded-lg">
          {fetchingAllProducts
            ? Array.from({ length: 4 }).map((id,index) => {
                return <ProductLoader key={index} />;
              })
            :(allProducts && allProducts.length > 0)? allProducts?.slice(0, 8)?.map((product: IProduct) => (
                  <ProductCard
                    product={product}
                  />
                )): ""} 
        </div>
      </div>

      {/* Best Sellers Products */}
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Best Sellers</h2>
          <Link className="text-[#086047]  flex items-center gap-2" to={
""}>
            <p className=" font-semibold">View More</p>
            <BsArrowRight />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-4 max-lg:flex flex-nowrap overflow-x-auto gap-x-4  gap-y-5 xl:gap-x-5 gap-3 rounded-lg">
          {fetchingAllProducts
            ? Array.from({ length: 4 }).map((id, index) => {
                return <ProductLoader key={index} />;
              })
            :(allProducts && allProducts.length > 0) ? allProducts?.slice(0, 8)?.map((product: IProduct) => (
                  <ProductCard
                    product={product}
                  />
                )) : ""}
        </div>
      </div>

      {/* Shop By Categories */}
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Shop by Categories
          </h2>
          <Link className="text-[#086047]  flex items-center gap-2" to={
""}>
            <p className=" font-semibold">More Categories</p>
            <BsArrowRight />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-6 max-lg:flex max-lg:flex-nowrap max-lg:overflow-auto rounded-lg gap-4 items-center">
          {categories.map((category: Category, index: number) => (
            <CategoriesCard
              key={index}
              icon={category.icon}
              category={category.category}
            />
          ))}
        </div>
      </div>

      {/* Year product */}
      <div className="mt-16">
        <div
          className="w-full h-80 mb-20 rounded-lg overflow-hidden relative before:content-['']
            before:absolute
            before:inset-0
            before:block
            before:bg-gradient-to-l
            before:from-[#086047]
            before:to-[#08604750]
            before:opacity-75
            before:z-[1]"
        >
          <img
          title=""
          alt=""
            className="w-[40%] h-full object-cover hidden md:inline-block object-top pt-5"
            src={
              "https://www.pngall.com/wp-content/uploads/14/Hoodie-Background-PNG.png"
            }
          />
          <div className="w-full md:w-2/3 xl:w-1/2 h-80 absolute px-5 md:px-0 top-0 right-0 flex flex-col items-start gap-6 max-md:gap-2 justify-center z-[2] text-white">
            <h1 className="text-3xl max-md:text-lg font-bold text-primeColor">
              Product of The year
            </h1>
            <p className="text-base max-md:text-sm font-normal max-w-[600px] mr-4 max-md:mb-5">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
              cupiditate modi amet! Facilis, aperiam quaerat.
            </p>
            <Link className="p-4 px-10 rounded-md font-semibold bg-[#086047] text-white" to={""}>
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Special Offers Products */}
      <div className="mt-16 mb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Special Offers</h2>
          <Link className="text-[#086047]  flex items-center gap-2" to={
""}>
            <p className=" font-semibold">View More</p>
            <BsArrowRight />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-4 max-lg:flex flex-nowrap overflow-x-auto gap-x-4  gap-y-5 xl:gap-x-5 gap-3 rounded-lg">
          {fetchingAllProducts
            ? Array.from({ length: 4 }).map((id, index) => {
                return <ProductLoader key={index} />;
              })
            : (allProducts && allProducts.length > 0) ? allProducts?.filter((dt: IProduct) => dt.discount_rate !== 0)?.slice(0, 8)?.map((product: IProduct) => (
                  <ProductCard
                  product={product}
                    // id={product.id}
                    // name={product.name}
                    // key={product.id}
                    // image={product.image_urls}
                    // category={product.category}
                    // isSpecialOffer
                    // discount={product.discount_rate}
                    // slashedPrice={numberWithCommas(product?.discounted_price)}
                    // price={numberWithCommas(product?.price)}
                  />
                )): ""}
        </div>
      </div>
    </section>
  );
}

export default App;
