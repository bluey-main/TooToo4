import AdminInfo from "../../components/admin/AdminInfo";
import BarChat from "../../components/charts/BarChat";
import { PieChat } from "../../components/charts/PieChat";
import AdminOrders from "./AdminOrders";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { AccountHeader } from "@/components/account/AccountHeader";

const AdminAnalytics = () => {

  const [recentProducts, setRecentProducts] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalSales, setTotalSales] = useState(0);
  const [yesterOrders, setYesterdayOrders] = useState(0);
  const [loading,setLoading] = useState(false);


  const fetchOrders = async()=>{
    const { data: orders, error } = await supabase.from("orders").select("*");
    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }
    const totalSales = orders.reduce((acc, eachOrder)=>{
      const price = Number(eachOrder.product.price)*eachOrder.product.quantity;
      return acc+=price;
    }, 0)
    const orderYesterday = orders.filter((eachOrder)=>{
      const today = new Date();
      const date = new Date(eachOrder.created_at);
      const yesterday = new Date(date.getTime() - 86400000).getDate();
      if(today.getDate()-yesterday==5){
        return eachOrder;
      }
    })
    setTotalSales(totalSales)
    setTotalOrders(orders.length)
    setYesterdayOrders(orderYesterday.length)

  }

  const fetchProducts = async()=>{
    const { data: products, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
      return;
    }
    const recentProducts = products.filter((eachProduct)=>{
      const today = new Date();
      const date = new Date(eachProduct.created_at);
      const yesterday = new Date(date.getTime() - 86400000).getDate();
      if(today.getDate()-yesterday<=5){
        return eachProduct;
      }
    })
    console.log(recentProducts);
    if(recentProducts.length==0){
      setLoading(true);
    }
    setRecentProducts(recentProducts)
  }

  useEffect(()=>{
    fetchOrders()
    fetchProducts();
  },[])




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

      <div className="py-5 px-3 bg-white rounded-2xl border">
        <div className=" px-5">
          <AccountHeader
            heading="Recent Products"
            text="Last 5 days"
            className="mb-5"
          />  
        </div>
        <div>
          {
            loading?<p className=" font-semibold">No Data Currently</p>:
            recentProducts.length==0?
            <p>loading...</p>:
            <div className=" w-full">
              <div className="relative overflow-x-auto border sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price ( $ )
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Category
                      </th>
                      
                    </tr>
                    
                  </thead>
                  <tbody>
                    {recentProducts.map((eachProduct, key) => {
                        return (
                          <tr
                            className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                            key={key}
                          >
                            <td className={`${eachProduct?.name.length>30&&"text-xs"} px-6 py-4`}>{eachProduct?.name || "N/A"}</td>
                            <td className="px-6 py-4">{Number(eachProduct?.price).toLocaleString() || "N/A"}</td>
                            <td className="px-6 py-4">{eachProduct?.quantity || "N/A"}</td>
                            <td className="px-6 py-4">{eachProduct?.category || "N/A"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="py-5 bg-white rounded-2xl border">
        <AdminOrders />
      </div>
    </div>
  );

};

export default AdminAnalytics;