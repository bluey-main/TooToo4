
import { useCallback, useContext, useEffect, useState } from 'react'
import { productData } from '../../../utils/testData'
import Pagination from "../../../components/pagination/Pagination"
import { PieChat } from '../../../components/charts/PieChat'
import BarChat from "../../../components/charts/BarChat"
import AdminInfo from '../../../components/admin/AdminInfo'
import axios from 'axios';
// import { useUser } from '../../../context/UserContext';
import toast from "react-hot-toast";
import { supabase } from "../../../lib/supabase";
import { convertDate } from '../../../utils/dataConverter'
import { useAuth } from '@/context/AuthContext'
import StripeAccountNotice from '@/components/StripeAccountNotice'
import { useSeller } from '@/context/SellerContext'

const Dashboard = () => {
    const {getSellerOrders} = useSeller();
    const { userDetails } = useAuth();
    const [totalOrders, setTotalOrders] = useState(0)
    const [totalSales, setTotalSales] = useState(0);
    const [yesterOrders, setYesterdayOrders] = useState(0);
    const [isSubscribed,setIsSubscribed] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [loading,setLoading] = useState(false);
    

    // const fetchSubscriptionStatus = async () => {
    //   if (!userDetails || !userDetails?.id) return;
      
    //   try {
    //     const { data: freshUser, error } = await supabase
    //       .from("users")
    //       .select("subscriptionStatus, subscriptionId")
    //       .eq("id", userDetails?.id)
    //       .single();

    //     if (error) {
    //       throw error;
    //     }

    //     // Check for both active and canceling states
    //     const isActive = freshUser?.subscriptionStatus === "active";
    //     const isCancelingStatus = freshUser?.subscriptionStatus === "canceling";

    //     const hasAccess = isActive || isCancelingStatus;
    
    //     setIsSubscribed(hasAccess);
    //     setIsCanceling(isCancelingStatus);
        
    //     return { hasAccess, isCanceling: isCancelingStatus };
    //   } catch (err) {
    //     console.error("Error fetching subscription status:", err);
    //     return false;
    //   }
    // };
  
  
    // const fetchOrders = useCallback(async () => {
    //   const orders = await getSellerOrders();
    //   const totalSales = orders.reduce((acc, eachOrder)=>{
    //     const price = Number(eachOrder.product.price)*eachOrder.product.quantity;
    //     return acc+=price;
    //   }, 0)
    //   const orderYesterday = orders.filter((eachOrder)=>{
    //     const today = new Date();
    //     const date = new Date(eachOrder.createdOn.seconds*1000);
    //     const yesterday = new Date(date.getTime() - 86400000).getDate();
    //     if(today.getDate()-yesterday==5){
    //       return eachOrder;
    //     }
    //   })
    //   setTotalSales(totalSales)
    //   setTotalOrders(orders.length)
    //   setYesterdayOrders(orderYesterday.length)
    // }, [getSellerOrders]);




    // useEffect(() => {
    //   const checkSubscriptionStatus = async () => {
    //     const subscriptionParam = new URLSearchParams(window.location.search).get("subscription");
    //     console.log("subscriptionParam:- ",subscriptionParam);

    //     // Handle subscription status from URL
    //     if (subscriptionParam === "success") {
    //       toast.success("Subscription activated successfully");
    //     } else if (subscriptionParam === "cancelled") {
    //       toast.error("Subscription cancelled");
    //     }

    //     // Fetch latest subscription status from DB
    //     await fetchSubscriptionStatus();
        
    //   };
    
    //   checkSubscriptionStatus();
    // }, [userDetails]);
    

    const handleSubscribe = async()=>{
      // setLoading(true);
      // try{
      //   const response = await axios.post("https://jamazan-backend-1zzk.onrender.com/subscription",{
      //     userId:userDetails?.uid
      //   },{
      //     withCredentials:true
      //   });
      //   if(response.data){
      //     window.location.href = response.data.url;
      //   }else{
      //     toast.error("Failed to create checkout session");
      //     console.log("No URL returned from Stripe");
      //   }
      //   setLoading(false);
      // }catch(error){
      //   console.log("error", error);
      //   toast.error("Failed to create checkout session");
      //   setLoading(false);
      // }finally{
      //   setLoading(false);
      // }
    }


    const handleCancelSubscription = async () => {
      // if (!userDetails || !userDetails?.uid) return;
      // setLoading(true);
    
      // try {
      //   const response = await axios.post(
      //     "https://jamazan-backend-1zzk.onrender.com/cancel-subscription",
      //     { userId: userDetails?.uid },
      //     {withCredentials:true},
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       }
      //     }
      //   );
      //   const data = response.data;
        
      //   if (data.success) {
      //     toast.success("Subscription will cancel at the end of the billing period.");

      //     await fetchSubscriptionStatus();
      //   }
      //   setLoading(false)
      // } catch (error) {
      //   toast.error("Failed to cancel subscription.");
      //   console.error("Subscription cancellation error:", error);
      //   setLoading(false);
      // }finally{
      //   setLoading(false);
      // }
    };


    const handleReactivateSubscription = async () => {
      // if (!userDetails || !userDetails?.uid || !userDetails?.subscriptionId) return;
      
      // setLoading(true);
      // try {
      //   const response = await axios.post(
      //     "https://jamazan-backend-1zzk.onrender.com/reactivate-subscription",
      //     { 
      //       userId: userDetails?.uid,
      //       subscriptionId: userDetails?.subscriptionId
      //     },
      //     {withCredentials: true},
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       }
      //     }
      //   );
    
      //   const data = response.data;
        
      //   if (data.success) {
      //     toast.success("Subscription has been reactivated.");
      //     await fetchSubscriptionStatus();
      //   }
      // } catch (error) {
      //   toast.error("Failed to reactivate subscription.");
      //   console.error("Subscription reactivation error:", error);
      // }
      // setLoading(false);
    };


    useEffect(()=>{
      console.log("USER DETAILS", userDetails);
    },[])
  
    
  
  return (
    <>
      <div className="pt-0 rounded-md">
        <StripeAccountNotice hasStripeAccount={Boolean(userDetails?.stripeAccountId)} isSubscribed={Boolean(userDetails?.subscriptionId)}/>
        <aside className="flex flex-col items-end">
          {isSubscribed && !isCanceling && <button
              onClick={handleCancelSubscription} disabled={loading}
              className={` w-fit ${loading?"bg-red-200":"bg-red-600"} mb-5 text-white p-5 border rounded-md hover:bg-red-700 transition-colors`}
            >
              {loading ? "Processing..." : "Cancel Subscription"}
            </button>
          }
          {isSubscribed && isCanceling && (
            <div className="flex flex-col items-end space-y-3 mb-5">
              <div className="subscription-canceling-notice bg-yellow-50 p-4 border border-yellow-200 rounded-md text-right">
                <p className="text-yellow-700 font-medium">
                  Your subscription is scheduled to end soon
                </p>
                {userDetails?.subscriptionInfo?.currentPeriodEnd && (
                  <p className="text-sm text-yellow-600">
                    Access ends on: {convertDate(userDetails?.currentPeriodEnd?.seconds)}
                  </p>
                )}
              </div>
              <button
                onClick={handleReactivateSubscription}
                disabled={loading}
                className={`w-fit ${loading?"bg-green-200":"bg-green-600"} text-white p-3 border rounded-md hover:bg-green-700 transition-colors disabled:opacity-50`}
              >
                {loading ? "Processing..." : "Reactivate Subscription"}
              </button>
            </div>
          )}
          <div>
            {/* USED TO DISPLAY THE TIME BEFORE SUBSCRIPTION ENDS */}
          <div>
            {
              userDetails && userDetails?.currentPeriodEnd?.seconds&&<p className=' text-sm font-semibold pt-2 pb-5'> 
              Subscription Ends on <span className=' text-red-500'>{convertDate(userDetails?.currentPeriodEnd?.seconds)}.</span>
            </p>
            }
          </div>
            
          </div>
          {!isSubscribed && (
            <button onClick={handleSubscribe} className={`w-fit ${loading?"bg-green-300":"bg-[#086047]"} mb-5 text-white p-5 border rounded-md hover:bg-[#064c3a] transition-colors`}>
              {loading ? "Processing..." : "Subscribe"}
            </button>
          )}
        </aside>
 {/* ... OTHER COMPONENTST RELATED TO THIS PAGE  */}
        {/* SELLER INFO  */}
        <section>
        <div className='grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 px-1 gap-5  '>
          <AdminInfo heading={"Total Sales Made"} money={true} amount={totalSales} isYesterday={false}/>
          <AdminInfo amount={totalOrders} isYesterday={false} heading={"Total Orders Made"} />
          <AdminInfo  amount={yesterOrders} isYesterday={true} heading={"Total Orders"} />
           
        </div>
        </section>
        
        {/* WHERE DASHBOARD ANALYTICS WOULD BE */}
        <div className="flex gap-10 overflow-hidden justify-between bg-white p-4 py-6 rounded-2xl w-[100%] h-fit border overflow-x-auto max-lg:flex-col max-lg:items-center">
          <BarChat getOrdersFunc={getSellerOrders}/>
          <PieChat />
      </div><br />
        
          {/* SELLER DATA */}
        <div className=' bg-white p-5 border rounded-md'>
          <main className='  pb-8'>
            <header className=' flex justify-between text-sm items-center'>
              <h1 className="text-lg font-semibold text-slate-600">Recent orders</h1>
              <button className=' border-[2px] px-2 py-1 font-sans rounded-md text-gray-400'>Export CSV</button>
            </header>
          </main>
          {/* MAPPING THROUGH THE FAKE API TO GET TITLE AND PRICES INORDER TO DISPLAY */}
          {/* MOBILE VIEW OF SELLERS PAGE */}
          <div className=' sm:hidden flex flex-col gap-2 rounded-lg'>
            {
              productData.slice(0,5).map((eachProduct)=>{
                return(
                  <div key={eachProduct.id} className=' rounded-md py-2 border-2 px-5 flex flex-col gap-5'>
                    <h1 className=' text-sm text-black font-semibold font-sans'>{eachProduct.title.slice(0,15)}...</h1>
                    
                    <div className=' border-t-[1px] flex flex-col gap-3 py-4'>
                      <section className='flex justify-between text-sm text-gray-700'>
                        <p>Price(₦)</p>
                        <p>{eachProduct.price}</p>
                      </section>
                      <section className='flex justify-between text-sm text-gray-700'>
                        <p>Quantity</p>
                        <p>{Math.floor(Math.random()*5)+1}</p>
                      </section>
                      <section className='flex justify-between text-sm text-gray-700'>
                        <p>Status</p>
                        <p>{Math.floor(Math.random()*2)==0?<span className=' text-yellow-400'>Pending</span>:<span className=' text-green-400'>Completed</span>}</p>
                      </section>
                      <section className='flex justify-between text-sm text-gray-700'>
                        <p>Date</p>
                        <p>16/07/2023</p>
                      </section>
                    </div>
                  </div>
                )

              })
            }
          </div>
          {/* DESKTOP VIEW OF SELLERS PAGE */}
          <div className=' max-sm:hidden  overflow-auto'>
            <table className="  w-full  text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr className=''>
                  <th scope={'col'} className=' px-10 py-5'>Items</th>
                  <th scope={'col'} className=' px-5 py-5'>Price (₦)</th>
                  <th scope={'col'} className=' px-10 py-5'>Quantity</th>
                  <th scope={'col'} className=' px-10 py-5'>Status</th>
                  <th scope={'col'} className=' px-5 py-5'>Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  productData.slice(0,5).map(function(eachProduct){
                    return(
                      <tr key={eachProduct.id} className="bg-white border-b  hover:bg-gray-50 ">
                        <td className="px-10 py-4">{eachProduct.title.slice(0,10)}...</td>
                        <td className="px-5 py-4">{eachProduct.price}</td>
                        <td className="px-12 py-4">{Math.floor(Math.random()*5)+1}</td>
                        <td className="px-10 py-4">{Math.floor(Math.random()*2)==0?<span className=' text-yellow-400'>Pending</span>:<span className=' text-green-400'>Completed</span>}</td>
                        <td className="px-5 py-4">16/07/2023</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        
        <section className=' py-5' >
            <select name="" className=' sm:hidden outline-none border-2 font-semibold text-slate-700 py-1 px-1 rounded-lg' id="">
              <option value="">5 per page</option>
              <option value="">10 per page</option>
            </select>
            <section className=' max-sm:hidden'>
              <Pagination/>
            </section>
        </section>
      </div>
    </>
  )
}

export default Dashboard
