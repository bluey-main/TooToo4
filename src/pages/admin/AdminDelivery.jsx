import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {ClipLoader} from "react-spinners"
import delivery from "../../assets/box-truck.png";

const AdminDelivery = () => {
  const [deliveryArray,setDeliveryArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveryStatus = async ()=>{
    try{
      const { data: orders, error: ordersError } = await supabase.from("orders").select("*");
      if (ordersError) {
        throw ordersError;
      }
      const orderWithAddress = await Promise.all(orders.map(async(eachOrder)=>{
        const { data: userAddress, error: addressError } = await supabase
          .from("addresses")
          .select("*")
          .eq("id", eachOrder.addressId)
          .single();
        if (addressError) {
          throw addressError;
        }
        return {...eachOrder,...userAddress}
      }));
      console.log(orderWithAddress);
      if(orderWithAddress.length==0){
        setLoading(true);
      }
      setDeliveryArray(orderWithAddress)
    }catch(error){
      console.log(error)
    }
  }


  useEffect(()=>{
    fetchDeliveryStatus()
  },[])


  return (
    <>
      <div className=" grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
      {loading?<p className=" font-semibold px-2 py-5">No Data to Display Currently</p>:
          deliveryArray.length==0?
          <div className=" flex flex-col items-center">
            <ClipLoader/>
          </div>
        :
        deliveryArray.map((eachAddress)=>{
          return(
            <section key={eachAddress.addressId} className=" mx-2 bg-gray-200 rounded-md px-2 py-3 flex flex-col gap-3">
              <header>
                <p className=" pb-2 text-xs font-semibold">Status: <span className={` font-light ${eachAddress.deliveryStatus==="pending"?" text-yellow-500":eachAddress.deliveryStatus==="cancelled"?" text-red-600":" text-green-500"}`}>{eachAddress.deliveryStatus}</span></p>
                <p className=" text-xs font-semibold">ID:<span className=" font-normal">&nbsp;{eachAddress.addressId}</span></p>
              </header>
              <main className=" bg-green-400 py-5 rounded-md flex flex-col items-center">
                <img src={delivery} className=" w-24" alt="" />
              </main>
              <footer className="flex flex-col gap-1">
                <p className=" text-xs min-[500px]:text-sm font-semibold">Street:<span className=" font-normal">&nbsp;{eachAddress.street}</span></p>
                <p className=" text-sm min-[500px]:text-base font-semibold">Product:<span className=" font-normal">&nbsp;{eachAddress.product.name}</span></p>
                <p className=" text-sm min-[500px]:text-base font-semibold">City:<span className=" font-normal">&nbsp;{eachAddress.city}</span></p>
              </footer>
            </section>
          )
        })
      }
      </div>
    </>
  );
};

export default AdminDelivery;