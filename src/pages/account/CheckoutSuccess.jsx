import  { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { supabase } from "@/lib/supabase";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    const purchaseId = new URLSearchParams(window.location.search).get("purchaseId");

    if (!status || !purchaseId) {
      console.log("Missing status or orderId");
      return;
    }

    const verifyOrder = async () => {
      if (status === "true") {
        // ✅ Check if order exists in DB
        const { data: order, error } = await supabase
          .from("orders")
          .select("id, payment_status")
          .eq("purchase_id", purchaseId)
        

        if (error) {
          console.error("Order lookup failed:", error);
          return;
        }

        if (order) {
          console.log("✅ Order exists:", order);
          
          // Only clear cart if order is actually marked paid
          if (order[0].payment_status === "paid") {
            clearCart();
          } else {
            console.log("⚠️ Order not paid yet, not clearing cart");
          }
        } else {
          console.log("❌ No order found with that ID");
        }
      }
    };

    verifyOrder();
  }, []);
  
  return (
    <div className="w-full h-full flex flex-col items-center gap-4 py-24 text-center">
      <div className="w-full h-full flex flex-col items-center gap-4 p-5">
        <img
          className="w-[450px] h-[280px]"
          src="https://bafybeihgcp6cg67ubbr4rgcfphxdyhpjuxdvonzidrarwovxjjej4vs4bu.ipfs.w3s.link/Ecommerce checkout laptop-cuate.svg"
          alt=""
        />
        <div className="flex items-center flex-col gap-1">
          <h1 className="font-bold text-2xl">Your checkout was successful.</h1>
          <Link
            to={"/account/orders"}
            className="flex items-center gap-2 text-[#086047] text-base font-semibold"
          >
            <span>View your orders</span>
            <BsArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;