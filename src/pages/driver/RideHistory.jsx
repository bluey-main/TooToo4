import Pagination from "../../components/pagination/Pagination";

import CustomerDeliveries from "../../components/drivers/CustomerDeliveries";
import { AccountHeader } from "@/components/account/AccountHeader";

const RideHistory = () => {
  return (
    <div className="flex flex-col gap-5 p-6 overflow-auto">
      <AccountHeader heading="Active Rides" text="" className="" />

      <div className="p-5 rounded-md bg-white gap-5 flex flex-col">
        <CustomerDeliveries />
      </div>

      <AccountHeader heading="Delivery History" text="" className="" />

      <div className="p-5 rounded-md bg-white gap-5 flex flex-col">
        <CustomerDeliveries isDelivered={true} />
      </div>

      {/**forward back buttons */}

      <div className="">
        <Pagination />
      </div>
    </div>
  );
};

export default RideHistory;