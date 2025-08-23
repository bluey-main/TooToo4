/* eslint-disable react/prop-types */
import { useState } from "react";
import Orders from "../../components/admin/Orders";
import { AccountHeader } from "@/components/account/AccountHeader";

const options = [
  {
    text: "All",
    url: "/all",
  },
  {
    text: "Confirmed",
    url: "/confirmed",
  },
  {
    text: "Pending",
    url: "/pending",
  },
  {
    text: "Cancelled",
    url: "/cancelled",
  },
];

const AdminOrders = ({ slice }) => {
  const [active, setactive] = useState(0);

  return (
    <div className="flex flex-col gap-5 p-6 overflow-auto">
      <AccountHeader   heading="Recent Orders" text="" className="" />

      <div className="p-5 rounded-md bg-white gap-5 flex flex-col ">
        <div className="flex justify-start gap-5 border-b border-b-black/10 overflow-x-auto">
          {options?.map((_, i) => (
            <p
              className={`${
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

        <Orders slice={slice} option={options[active].text}/>
      </div>
    </div>
  );
};

export default AdminOrders;
