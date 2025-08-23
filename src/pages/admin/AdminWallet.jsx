/* eslint-disable react/no-unknown-property */
import axios from "axios";
import { useState,useEffect } from "react";
import {ClipLoader} from "react-spinners"

const AdminWallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [stripeAvailable, setStripeAvailable] = useState(0);
  const [stripePending, setStripePending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [balance,transactions] = await Promise.all([axios.get("https://jamazan-backend-1zzk.onrender.com/balance", {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }),axios.get("https://jamazan-backend-1zzk.onrender.com/transactions", {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      })]);



      console.log("BALANCE DATA",balance);
      console.log("TRANSACTIONS DATA",transactions);

      setStripeAvailable(balance.data.summary.available);
      setStripePending(balance.data.summary.pending);
      setTransactions(transactions.data.formatted);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Unable to load wallet information. Please try again later.");
    }finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      window.location.href = "https://dashboard.stripe.com/";
    } catch (err) {
      setError("Withdrawal request failed. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };


  useEffect(()=>{
    fetchInfo()
  },[])

  return (
    <section className="bg-white p-5 rounded-lg">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-x-10 items-stretch max-[920px]:flex-col">
        <div className="  w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-default-600 font-semibold text-[20px]">
              Your wallet
            </h3>
          </div>
          <div className="w-full p-8 my-4 h-[240px] flex flex-col justify-between bg-[url('https://bafybeidr5h2c5a7ylvl3xep63hkqkijtklxj2na6s2ut47zxmnfmntcine.ipfs.nftstorage.link/Group.png')] rounded-lg">
          {
            isLoading ? (
              <div className="flex items-center justify-center h-full">
                <ClipLoader size={30} />
              </div>
            ):(
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-primary font-semibold">
                    Current balance:
                  </h3>{" "}
                  <h3 className="text-[23px] text-primary font-semibold">
                    ${stripeAvailable.toLocaleString()}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-primary font-semibold">
                    Pending balance:
                  </h3>{" "}
                  <h3 className="text-[23px] text-primary font-semibold">
                    ${stripePending.toLocaleString()}
                  </h3>
                </div>
                <div className="flex flex-col gap-x-4">                
                  <button 
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#305c45] px-2.5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#305c45ce] focus:outline-none focus:ring-2 focus:ring-[#305c45b5] focus:ring-offset-2 sm:w-full sm:flex-grow-0 mt-5"
                    variant="bordered"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || stripeAvailable <= 0}
                  >
                    {isWithdrawing ? (
                      <ClipLoader size={16} color="#ffffff" className="mr-2" />
                    ) : null}
                    {stripeAvailable <= 0 ? "No funds to withdraw" : "Withdraw"}
                  </button>
                </div>
              </>
            )
          }
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-default-600 text-[17px]">
          Transaction history
        </h3>
        <div className="relative overflow-x-auto border sm:rounded-lg mt-4">
          {
            isLoading ? (
              <div className="flex items-center justify-center py-10">
                <ClipLoader />
              </div>
            ):
            transactions.length==0?
            <div className="flex items-center justify-center py-10 text-gray-500">
              No transactions found
            </div>
              :
            <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Paid($)
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                  return (
                    <tr
                      className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                      key={transaction.id}
                    >
                      <td className="px-6 py-4">{transaction.id}</td>
                      <td className="px-6 py-4">{transaction.net.toLocaleString()}</td>
                      <td className="px-6 py-4">{transaction.created}</td>
                      <td className={`px-6 capitalize py-4 ${transaction.status==="pending"?" text-yellow-500":transaction.status==="cancelled"?" text-red-600":" text-green-500"}`}>{transaction.status}</td>
                      <td className="px-6 py-4">{(transaction.type).toLocaleString()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          }
        </div>
        <div className="flex justify-between items-center mt-5">
          <button
            className="rounded-md border border-transparent bg-green-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={() => window.open("https://dashboard.stripe.com/payments", "_blank")}
          >
            See More in Stripe Dashboard
          </button>
          
          {transactions.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing {transactions.length} transaction(s)
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminWallet;
