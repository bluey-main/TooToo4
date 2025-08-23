import { Outlet, useNavigate } from "react-router";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollStartAtTop";
import { useProfile } from "@/context/ProfileContext";
import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51P81xGRsmFh9wreMAPKsFUb4rxicJJyWp347tq7y0qgksvvXJC2EVepIwk2SkzENu8InXzOUSHyAYFV1j0w3BG0q00Gk8PmyRr"
);
const UserRoot = () => {
  const navigate = useNavigate()
  const {profile} = useProfile()

  useEffect(() => {
    if(!profile?.first_name){
      navigate("/account/profile/edit-profile")
    }
  }, [profile?.first_name, navigate])
  return (
    <>
      <NavBar />
      <ScrollToTop/>
      <div className="container mx-auto">
        <Elements stripe={stripePromise}>
          <Outlet />
        </Elements>
      </div>
      <Footer />
    </>
  );
};

export default UserRoot;