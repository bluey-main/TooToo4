import  { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if(!status){ 
      console.log("No Status");
      return
    }
    if(status==="true"){
      console.log("OKAY");
      clearCart();
    }
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