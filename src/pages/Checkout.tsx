import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { FaMinus, FaPlus } from "react-icons/fa";
import { BsArrowRight, BsCheck, BsClock } from "react-icons/bs";
// import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import DeliveryAddress from "../components/account/DeliveryAddress";
import { AccountButtonOutline } from "../components/Buttons/AccountButtons";
import axios from "axios";
import toast from "react-hot-toast";
import { numberWithCommas } from "../utils/helper";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { AccountHeader } from "@/components/account/AccountHeader";
import { CartProduct } from "@/types/types";

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart, getCartTotal } = useCart();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [enrichedCart, setEnrichedCart] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [status, setStatus] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  // const host = "https://jamazan-backend-ao9e.onrender.com";
  const host =
    import.meta.env.VITE_NODE_ENV === "PRODUCTION"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:7000";

  const updateCartWithStripeId = async () => {
    const cartItemsWithStripeId = await Promise.all(
      cartItems.map(async (item: CartProduct) => {
        try {
          const { data: sellerInfo, error } = await supabase
            .from("profiles")
            .select("stripe_account_id, vendor_type")
            .eq("id", item.seller_id)
            .single();

          if (error) {
            throw error;
          }
          // console.log("Supabase Data", sellerInfo)

          return {
            ...item,
            stripeId: sellerInfo?.stripe_account_id,
            vendorType: sellerInfo?.vendor_type || "basic",
          };
        } catch (error) {
          console.error(
            `Failed to fetch seller info for ${item.seller_id}`,
            error
          );
          return {
            ...item,
            stripeId: null,
            vendorType: "basic",
          };
        }
      })
    );
    console.log("ttt",cartItemsWithStripeId);
    setEnrichedCart(cartItemsWithStripeId);
  };

  useEffect(() => {
    updateCartWithStripeId();
  }, [cartItems]);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const response = await fetch(`/session-status?session_id=${sessionId}`);
        const data = await response.json();
        setStatus(data.status);
        setEmail(data.customer_email);
        if (data.status === "complete") {
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        } else {
          console.log("SOMETHING ELSE", data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSession();
  }, []);

  const makePayment = async () => {
    console.log("CART CHECK",cartItems);
    console.log(
      "products:",
      enrichedCart,
      "userId:",
      userDetails?.id,
      "addressId:",
      selectedAddress
    );
    if (selectedAddress.length < 1) {
      toast.error("Please select an address to continue.");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${host}/create-checkout-session`,
        {
          products: enrichedCart,
          userId: userDetails?.id,
          addressId: selectedAddress,
        },
        {
          withCredentials: true,
        }
      );

      console.log("OKAY", res);

      if (res.data) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to create checkout session");
        console.log("No URL returned from Stripe");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errMsg = error?.response?.data?.message || "An error occurred";
      toast.error(errMsg);
      console.log(error);
    }
  };

  return (
    <>
      {status && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700">
          Payment Status: {status} <br />
          {email && <>Email: {email}</>}
        </div>
      )}

      {userDetails ? (
        <div className="">
          <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 max-md:pt-5 sm:px-6 lg:max-w-7xl lg:px-8">
            <AccountHeader hasBack text="" heading={`Checkout`} />

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 mt-5">
              <div>
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Delivery Information
                  </h2>
                  <DeliveryAddress
                    onAddressSelected={(address) => setSelectedAddress(address)}
                    isHome={false}
                  />
                  <div className="flex justify-end mt-5 py-3">
                    <AccountButtonOutline
                      text="Add new address"
                      onClick={() => {
                        navigate("/account/profile/add-new-address");
                      }}
                      className="px-5"
                    />
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <h3 className="sr-only">Items in your cart</h3>
                  <ul role="list" className="divide-y divide-gray-200 px-6">
                    {cartItems.map(
                      (product: CartProduct, productIdx: number) => (
                        <li key={product.id} className="flex py-6 sm:py-6">
                          <div className="flex-shrink-0 border rounded-lg">
                            <img
                              alt={product.id}
                              src={product.image_urls[0].url}
                              className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                            <div className="relative flex justify-between max-xl:flex-col sm:gap-x-6 sm:pr-0">
                              <div>
                                <div className="flex justify-between">
                                  <h3 className="text-sm line-clamp-2">
                                    <a
                                      // href={product.href}
                                      href={""}
                                      className="font-medium text-gray-700 hover:text-gray-800"
                                    >
                                      {product.name}
                                    </a>
                                  </h3>
                                </div>
                                {/* <div className="mt-1 flex text-sm">
                                <p className="text-gray-500">
                                  {product.category}
                                </p>
                              </div> */}
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  ${numberWithCommas(product.discounted_price)}
                                </p>
                              </div>

                              <div className="mt-4">
                                <label
                                  htmlFor={`quantity-${productIdx}`}
                                  className="sr-only"
                                >
                                  Quantity, {product.quantity}
                                </label>
                                <div className=" flex gap-4 items-center justify-evenly bg-black/[3%] rounded-lg px-3 py-2 select-none text-sm w-fit">
                                  <FaMinus
                                    className="flex items-center justify-center text-sm font-semibold text-[#086047] cursor-pointer"
                                    onClick={() =>
                                      product.quantity > 1
                                        ? removeFromCart(product)
                                        : {}
                                    }
                                  />
                                  <p className="mx-2 w-3 text-black-50 font-semibold">
                                    {product.quantity}
                                  </p>
                                  <FaPlus
                                    className="flex items-center justify-center text-[#086047] text-sm font-semibold cursor-pointer"
                                    onClick={() => addToCart(product)}
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                              {product.quantity !== 0 ? (
                                <BsCheck
                                  className="h-5 w-5 flex-shrink-0 text-green-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <BsClock
                                  className="h-5 w-5 flex-shrink-0 text-gray-300"
                                  aria-hidden="true"
                                />
                              )}

                              <span>
                                {product.quantity !== 0
                                  ? "In stock"
                                  : `Ships in " 14 days"}`}
                              </span>
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                  <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${getCartTotal()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        $0.00
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Taxes</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        $0.00
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Total</dt>
                      <dd className="text-base font-medium text-gray-900">
                        ${getCartTotal()}
                      </dd>
                    </div>
                  </dl>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <button
                      disabled={cartItems.length < 1 || isLoading}
                      onClick={() => makePayment()}
                      className="w-full rounded-md border border-transparent bg-[#086047] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#086047] focus:outline-none focus:ring-2 focus:ring-[#086047] focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div
                          className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      ) : (
                        "Confirm Order"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center gap-4 py-24 text-center">
          <div className="w-full h-full flex flex-col items-center gap-4 p-5">
            <img
              className="w-[280px] h-[280px]"
              src="https://bafybeidl33fbxkd77oaj3d2hwzwctbf7lhlb242kuuldob2vimlem37c24.ipfs.w3s.link/Login-cuate.svg"
              alt=""
            />
            <div className="flex items-center flex-col gap-1">
              <h1 className="font-bold text-xl">
                You have to be logged in to checkout products
              </h1>
              <Link
                to={"/auth/login"}
                className="flex items-center gap-2 text-[#086047] text-base font-semibold"
              >
                <span>Sign in to your account</span>
                <BsArrowRight />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
