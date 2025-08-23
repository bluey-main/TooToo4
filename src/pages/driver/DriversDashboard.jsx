import { AccountHeader } from "@/components/account/AccountHeader";
import BarChat from "../../components/charts/BarChat";


import CustomerDeliveries from "../../components/drivers/CustomerDeliveries";

const DriversDashboard = () => {
  return (
    <div className="flex flex-col gap-5 p-5 overflow-auto">
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        <AdminInfo />
        <AdminInfo />
        <AdminInfo />
      </div>

      <div className="flex gap-10 overflow-hidden justify-between bg-white p-4 py-6 rounded-2xl w-[100%] h-fit border overflow-x-auto max-lg:flex-col max-lg:items-center">
        <div className=" bg-white rounded-2xl w-full">
          <AccountHeader heading="Active Deliveries" text="" className="mb-5" />
          <CustomerDeliveries />
        </div>

      
      </div>
    </div>
  );

  function AdminInfo() {
    return (
      <div className="p-6 flex-col  bg-white w-full rounded-2xl border">
        <p className="text-neutral-400 text-lg font-normal mb-5">
          Active Rides
        </p>

        <h1 className="text-neutral-700 text-[28px] font-medium mb-3">
          $ 185,700
        </h1>

        <p className="text-neutral-700 text-sm font-normal leading-tight inline-flex gap-2 items-center">
          <span className="px-3 py-1 text-[#0d0d0d] bg-[#305c4523] rounded-3xl font-medium">
            4.8%
          </span>
          from yesterday
        </p>
      </div>
    );
  }
};

export default DriversDashboard;
