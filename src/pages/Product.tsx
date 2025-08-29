import { useEffect, useState } from "react";
import { BsCartPlus, BsChevronRight } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { numberWithCommas } from "../utils/helper";
import { ClipLoader } from "react-spinners";
import "../index.css";
import toast from "react-hot-toast";
import Liked from "@/components/Liked";
import NotLiked from "@/components/NotLiked";
import RelatedProducts from "@/components/RelatedProducts";
import Reviews from "@/components/Reviews";
import { IProduct } from "@/App";
import { useAuth } from "@/context/AuthContext";

interface ProductProps {
  isAdmin?: boolean;
}

interface IUser {
  uid: string;
  business_name: string;
  email: string;
  phone_number: string;
}

interface SupabaseUser {
  id: string;
  business_name: string;
  email: string;
  phone_number: string;
  likedItems?: IProduct[];
}

interface IParticularProduct extends IProduct {
  seller: IUser;
}

const Product: React.FC<ProductProps> = ({ isAdmin = false }) => {
  const { loading, reduceProductQuantity, addToCart, isItemInCart } = useCart();
  const { userDetails } = useAuth();
  const [indexValue, setIndexValue] = useState(0);
  const [selectedProduct, setSelectedProduct] =
    useState<IParticularProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [liked, setLiked] = useState(false);

  // const loggedInUser: { uid: string } | null = JSON.parse(
  //   localStorage.getItem("userDetails") || "null"
  // );

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    if (!id) return;
    setLoadingProduct(true);
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    console.log(product);

    if (productError || !product) {
      console.error("Error fetching product:", productError);
      setLoadingProduct(false);
      return;
    }

    const { data: sellerDetails, error: sellerError } = await supabase
      .from("profiles")
      .select("id, business_name, email, phone_number")
      .eq("id", product.seller_id)
      .single<SupabaseUser>();

    if (sellerError || !sellerDetails) {
      console.error("Error fetching seller details:", sellerError);
      setLoadingProduct(false);
      return;
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    setSelectedProduct({
      id,
      ...product,
      seller: {
        uid: sellerDetails.id,
        business_name: sellerDetails.business_name,
        email: sellerDetails.email,
        phone_number: sellerDetails.phone_number,
      } as IUser,
    });

    setLoadingProduct(false);
  };

  const checkIfLiked = async () => {
    if (!userDetails) return;
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("likedItems")
        .eq("id", userDetails.id)
        .single<SupabaseUser>();

      if (error) throw error;

      const likedProducts = userData?.likedItems || [];
      if (likedProducts.some((p) => p.id === id)) {
        setLiked(true);
      }
    } catch (error) {
      console.error("Error checking if liked:", error);
    }
  };

  const likedProduct = async () => {
    if (!userDetails) {
      return toast.error("Please login to like the product");
    }
    if (!liked && selectedProduct) {
      try {
        const { data: userData, error: fetchError } = await supabase
          .from("profiles")
          .select("likedItems")
          .eq("id", userDetails.id)
          .single<SupabaseUser>();

        if (fetchError) throw fetchError;

        const currentLikedItems = userData?.likedItems || [];
        const updatedLikedItems = [...currentLikedItems, selectedProduct];

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ likedItems: updatedLikedItems })
          .eq("id", userDetails.uid);

        if (updateError) throw updateError;

        setLiked(true);
        toast.success("Product added to liked items!");
      } catch (error) {
        console.error("Error adding to liked items:", error);
        toast.error("Failed to like the product. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    const checkIfLikedItemsArrayExist = async () => {
      if (!userDetails) return;
      try {
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("likedItems")
          .eq("id", userDetails.id)
          .single<SupabaseUser>();

        if (error) throw error;

        if (!userData?.likedItems) {
          await supabase
            .from("profiles")
            .update({ likedItems: [] })
            .eq("id", userDetails.id);
        }
      } catch (error) {
        console.error("Error checking if liked items array exist:", error);
      }
    };

    checkIfLikedItemsArrayExist();
    checkIfLiked();
  }, []);

  const tabs = ["Product Details", "Customer Reviews"];
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const reviews = {
    average: 4,
    totalCount: 1624,
    counts: [
      { rating: 5, count: 1019 },
      { rating: 4, count: 162 },
      { rating: 3, count: 97 },
      { rating: 2, count: 199 },
      { rating: 1, count: 147 },
    ],
    featured: [
      {
        id: 1,
        rating: 5,
        content: `
          <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
        `,
        author: "Emily Selman",
        avatarSrc:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
      },
    ],
  };

  const isSpecialOffer =
    selectedProduct?.discount_rate || selectedProduct?.discount_rate !== 0;

  return (
    <section className={`${!isAdmin && "py-14"} relative`}>
      {loadingProduct ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <ClipLoader />
          <p>Loading Product Details</p>
        </div>
      ) : selectedProduct ? (
        <>
          {isAdmin && (
            <p className="flex items-center gap-2 py-5 px-5 max-md:text-sm">
              <Link to={-1 as any}>Products</Link> <BsChevronRight />
              <span className="font-semibold">{selectedProduct?.name}</span>
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 max-md:px-4 md:items-center">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center h-[400px] bg-white rounded-xl border relative">
                <div
                  className="absolute cursor-pointer top-5 right-7"
                  onClick={likedProduct}
                >
                  {liked ? <Liked /> : <NotLiked />}
                </div>

                {selectedProduct?.image_urls?.length > 0 && (
                  <img
                    className="rounded-3xl w-full h-full object-contain"
                    src={selectedProduct.image_urls[indexValue].url}
                    alt=""
                  />
                )}
              </div>
              <ul className="flex w-full custom-scrollbar overflow-x-auto bg-orange-6 flex-nowrap gap-3 items-center justify-center">
                <div className="px-[18rem]"></div>
                {selectedProduct?.image_urls?.length > 0 ? (
                  selectedProduct?.image_urls?.map((item, index) => (
                    <li
                      className="flex-shrink-0 size-[130px]"
                      key={index}
                      onClick={() => setIndexValue(index)}
                    >
                      <img
                        className="w-[130px] h-[130px] object-contain cursor-pointer bg-white border rounded-xl bottom-2 hover:opacity-40 hover:border-[#086047] transition duration-200 ease-in-out p-4"
                        src={item?.url}
                        alt=""
                      />
                    </li>
                  ))
                ) : (
                  <h1>No Images Found</h1>
                )}
              </ul>
            </div>
            <div className="w-full py-16 max-md:p-4">
              <p
                onClick={() =>
                  navigate(`/vendor/${selectedProduct?.seller?.uid}`)
                }
                className="text-[#086047] font-bold mb-5 cursor-pointer"
              >
                {selectedProduct?.seller?.business_name}
              </p>
              <h1 className="text-black text-4xl font-extrabold mb-6">
                {selectedProduct?.name}
              </h1>
              <p className="text-slate-400 mb-6 capitalize line-clamp-3">
                {selectedProduct?.description}
              </p>
              {isSpecialOffer && (
                <div className="flex items-center justify-start gap-4 mb-1">
                  <h1 className="text-base text-slate-500 line-through font-semibold">
                    $
                    {numberWithCommas(
                      (Math.round(selectedProduct?.price * 100) / 100).toFixed(
                        2
                      )
                    )}
                  </h1>
                </div>
              )}

              <div className="flex items-center justify-start gap-4 mb-10">
                <h1 className="text-xl text-[#086047] font-semibold">
                  $
                  {numberWithCommas(
                    (
                      Math.round(selectedProduct?.discounted_price * 100) / 100
                    ).toFixed(2)
                  )}
                </h1>
                {isSpecialOffer && (
                  <h1 className="text-[#086047] p-1 px-3 text-sm rounded-lg bg-[#086047]/10 font-bold">
                    -{selectedProduct?.discount_rate}%
                  </h1>
                )}
              </div>
              {/* <h1 className="text-slate-400 text-lg font-semibold line-through mb-10">
            $250
          </h1> */}
              {!isAdmin && loading ? (
                <div className="flex justify-start items-center gap-6">
                  <ClipLoader />
                </div>
              ) : (
                <div className="flex justify-start items-center gap-6">
                  {isItemInCart(selectedProduct) && (
                    <div className=" flex gap-4 items-center justify-evenly bg-black/[3%] rounded-lg px-4 py-3 select-none">
                      <FaMinus
                        className="flex items-center justify-center text-lg font-semibold text-[#086047] cursor-pointer"
                        onClick={() => {
                          reduceProductQuantity(selectedProduct);
                        }}
                      />
                      <p className="mx-4 w-3 text-black-50 font-semibold">
                        {isItemInCart(selectedProduct).quantity}
                      </p>
                      <FaPlus
                        className="flex items-center justify-center text-[#086047] text-lg font-semibold cursor-pointer"
                        onClick={() => {
                          addToCart(selectedProduct);
                        }}
                      />
                    </div>
                  )}
                  {isItemInCart(selectedProduct) ? (
                    <div>
                      <p>
                        ({isItemInCart(selectedProduct).quantity}) items in cart
                      </p>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                        }}
                        className=" bg-[#086047] hover:bg-[#086047]/80 text-white py-3 px-6 rounded-lg flex items-center gap-3 font-semibold"
                      >
                        <BsCartPlus />
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            {/* <RelatedProducts category={selectedProduct.category_id} id={id} /> */}
          </div>
          <div className="mt-14 bg-white p-10 border rounded-xl">
            <div className="flex gap-10 items-center font-semibold border-b mb-10">
              {tabs.map((val, index) => {
                return (
                  <p
                    onClick={() => setSelectedTabIndex(index)}
                    className={`select-none cursor-pointer pb-2 border-b-[3px]  ${
                      selectedTabIndex == index
                        ? "border-b-[#086047] text-[#086047]"
                        : "border-b-transparent"
                    }`}
                    key={index}
                  >
                    {val}
                  </p>
                );
              })}
            </div>
            {selectedTabIndex == 1 ? (
              <Reviews reviews={reviews} product={selectedProduct} />
            ) : (
              <div>
                <h3 className="font-bold mb-3 text-lg">Product Description</h3>
                <pre className="text-sm">{selectedProduct.description}</pre>
                <h3 className="font-bold mb-3 text-lg mt-10">
                  Other Information
                </h3>
                <ul className="text-base list-disc space-y-1">
                  {selectedProduct?.other_info?.split("\n").map((d, i) => {
                    return <li key={i}>{d}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className=" hidden"></div>
      )}
    </section>
  );
};

export default Product;
