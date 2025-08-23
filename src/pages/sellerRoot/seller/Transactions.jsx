import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';


const months = ["January","February","March","April","May","June",
"July","August","September","October","November","December"]

const options = [
    {
      text: "All",
      url: "/all",
    },
    {
      text: "Withdrawl",
      url: "/withdrawl",
    },
    {
      text: "Credit",
      url: "/credit",
    }
  ];

  
function Transactions() {
    
  const [active, setactive] = useState(0);

  const handleTransactionInfo = (id)=>{
    return(
      console.log(id)
    )
  }
  return (
    <React.Fragment>
        <div>
        <div className=' md:text-base text-xs space-y-4 font-semibold'>
          <h1>Transaction History</h1>
          <div className=' flex justify-between'>
          <select   className=' text-gray-500 font-light   outline-none border-2 py-1 px- rounded-lg'>
              <option value="">All</option>
              <option value="">Withdrawl</option>
              <option value="">Credit</option>
            </select>
            <aside className=' space-x-2'>
              <select className=' text-gray-500 font-light   outline-none border-2 py-1 px- rounded-lg' name="" id="">
                {
                  months.map(function(eachMonth,index){
                    return(
                      <option value="" key={index+'1'}>{eachMonth}</option>
                    )
                  })
                }
              </select>
              <button className=' border-[2px] px-2 py-1 font-sans rounded-md text-gray-500'>Export </button>
            </aside>
          </div>
        </div>

        <main>
           {/* MOBILE VIEW OF SELLERS WITHDRAWL PAGE */}
          <div className=' mt-8 sm:hidden flex flex-col gap-2'>
              {
                productData.slice(0,5).map((eachProduct)=>{
                  return(
                      <div onClick={function(){
                        handleTransactionInfo(eachProduct.id)
                      }}  key={eachProduct.id} className=' rounded-md py-2 border-2 px-5 flex flex-col gap-5'>
                        <h1 className=' text-sm text-black font-semibold font-sans'>{eachProduct.title.slice(0,10)}...</h1>  
                        <div className=' border-t-[1px] flex flex-col gap-3 py-4'>
                          <section className='flex justify-between text-sm text-gray-700'>
                            <p>Amount(₦)</p>
                            <p>{eachProduct.price}</p>
                          </section>
                          <section className='flex justify-between text-sm text-gray-700'>
                            <p>Type</p>
                            <p>{Math.floor(Math.random()*2)==0?<span >Credit</span>:<span >Debit</span>}</p>
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
            {/* DESKTOP VIEW OF SELLERS WITHDRAWL PAGE */}
           <div className="px-2 py-5 border-2 my-10 max-sm:hidden  rounded-md bg-white gap-5 flex flex-col">
              <div className="flex justify-start gap-5 border-b border-b-black/10">
                {options?.map((_, i) => (
                  <p className={`${
                      active === i
                        ? "text-[#305C45] border-b-[#305C45]"
                        : "text-black/40"
                    } px-1 pb-3 border-b-transparent 
                    hover:text-[#305C45] text-sm  border-b-4 rounded-b-md cursor-pointer`}
                    key={_.text}
                    onClick={() => setactive(i)}
                  >
                    {_.text}
                  </p>
                ))}

              </div>
              <div className=' max-sm:hidden  overflow-auto'>
                <table className="  w-full  text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr className=''>
                      <th scope={'col'} className=' px-10 py-5'>Items</th>
                      <th scope={'col'} className=' px-5 py-5'>Amount (₦)</th>
                      <th scope={'col'} className=' px-10 py-5'>Type</th>
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
                            <td className="px-10 py-4">{Math.floor(Math.random()*2)==0?<span >Credit</span>:<span >Debit</span>}</td>
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
          
        </main>
    </div>

    </React.Fragment>
  )
}

export default Transactions