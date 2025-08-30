import AdminInfo from "../../components/admin/AdminInfo";
import BarChat from "../../components/charts/BarChat";
import { PieChat } from "../../components/charts/PieChat";
import AdminOrders from "./AdminOrders";
import { supabase } from "../../lib/supabase"; 
import { useEffect, useState } from "react";
import UploadCover from "../../components/admin/UploadCover";

const AdminDashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalSales, setTotalSales] = useState(0);
  const [yesterOrders, setYesterdayOrders] = useState(0);

  // const fetchOrders = async()=>{
  //   const { data: orders, error } = await supabase.from("orders").select("*");
  //   if (error) {
  //     console.error("Error fetching orders:", error);
  //     return;
  //   }
  //   const totalSales = orders.reduce((acc, eachOrder)=>{
  //     const price = Number(eachOrder.product.price)*eachOrder.product.quantity;
  //     return acc+=price;
  //   }, 0)
  //   const orderYesterday = orders.filter((eachOrder)=>{
  //     const today = new Date();
  //     const date = new Date(eachOrder.created_at);
  //     const yesterday = new Date(date.getTime() - 86400000).getDate();
  //     if(today.getDate()-yesterday==5){
  //       return eachOrder;
  //     }
  //   })
  //   setTotalSales(totalSales)
  //   setTotalOrders(orders.length)
  //   setYesterdayOrders(orderYesterday.length)
  // }

  // useEffect(()=>{
  //   fetchOrders();
  // },[])




  return (
    <div className="flex flex-col gap-5 p-5 overflow-auto">
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        <AdminInfo heading={"Total Sales Made"} money={true} amount={totalSales} isYesterday={false}/>
        <AdminInfo amount={totalOrders} isYesterday={false} heading={"Total Orders Made"} />
        <AdminInfo  amount={yesterOrders} isYesterday={true} heading={"Total Orders"} />
      </div>

      <div className="flex gap-10 overflow-hidden justify-between bg-white p-4 py-6 rounded-2xl w-[100%] h-fit border overflow-x-auto max-lg:flex-col max-lg:items-center">
        <BarChat />
        <PieChat />
      </div>

      <div>
        <UploadCover/>
      </div>

      <div className="py-5 bg-white rounded-2xl border">
        <AdminOrders slice={5}/>
      </div>
    </div>
  );
};

export default AdminDashboard;