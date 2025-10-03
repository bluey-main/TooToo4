import React, { useContext, useEffect, useState } from "react";
import WalletCard from "../../../components/seller/WalletCard";
import AddAddress from "./AddAddress";
import { useNavigate } from "react-router";
// import { useUser } from "../../../context/UserContext";
import {  useSeller } from "../../../context/SellerContext";

import axios from "axios";
import { useAuth } from "@/context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const [displayAddress, setDisplayAddress] = useState(false);
  const [balance,setBalance] = useState(0);
  const { userDetails } = useAuth();
  const {sellerOrders, getSellerOrders} = useSeller()
 const host =
    import.meta.env.VITE_NODE_ENV === "PRODUCTION"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:7000";
  

  useEffect(()=>{
    const fetchVendorBalance = async()=>{
      try{
        const response = await axios.post(`${host}/vendor-balance`,{
          stripeId:userDetails.stripe_account_id

        },{
          withCredentials:true
        });
        const data = response.data;
        setBalance(data.balance);
        console.log("DATA",data);
      }catch(error){
        console.log("An Unexpected ",error);
      }
    }
    fetchVendorBalance();
  },[]);

  useEffect(() => {
    if(!sellerOrders){
      getSellerOrders()
    }
  }, [])
  return (
    <React.Fragment>
      <div className=" bg-white px-2 py-1 rounded-md ">
        <div className=" max-[370px]:flex-col  max-[370px]:items-start  max-[370px]:gap-3  flex justify-between px-1 items-center">
          <section className=" space-y-2">
            <p className=" font-semibold text-3xl">
              Hello, <span>{userDetails ? userDetails.username : ""}</span>
            </p>
            <p className=" text-gray-500 space-x-1 text-sm font-medium">
              <span>{userDetails ? userDetails.phone_number : ""}</span>
              <span>|</span>
              <span>{userDetails ? userDetails.email : ""}</span>
            </p>
          </section>
          <button
            onClick={function () {
              navigate("edit-profile");
            }}
            className=" h-fit text-base border-[1px] text-green-600 font-medium py-1 px-2 rounded-md border-green-600"
          >
            Edit profile
          </button>
        </div>
        <div className=" flex flex-col md:grid md:grid-cols-2 md:items-center md:gap-4  px-1">
          <section className=" sm:py-2">
            <WalletCard name={userDetails?.username || "User Name"} balance={balance}/>
          </section>
          <section className=" justify-around flex flex-col rounded-md px-3 py-4 h-[132px] bg-gray-50 ">
            <p className=" font-semibold text-gray-600">Orders this month</p>
            <p className=" text-2xl text-gray-600">{sellerOrders ? sellerOrders.length : 0}</p>
          </section>
        </div>
        {/* <div className=" py-5 px-2 space-y-4 divide-y-2">
          <p className=" font-semibold">Delivery address</p>
          <section className=" text-gray-700 text-sm pt-4 space-y-2">
            <p>Address:9, shobande street, 4th avenue Festac ope</p>
            <p>Lagos</p>
            <p>Okota LGA</p>
            <p>
              Contact: <span>08106307420</span>
            </p>
          </section>
          <aside className=" px-3 flex flex-col items-end py-3">
            <button
              
        </div> */}
      </div>
    </React.Fragment>
  );
}

export default Profile;
