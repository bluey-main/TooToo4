import Pagination from "../../components/pagination/Pagination";
import Customers from "../../components/admin/Customers";
import CustomerDeliveries from "../../components/drivers/CustomerDeliveries";
import { MenuButton } from "../../components/Buttons/MenuButton";

import DriverMapsDirection from "./DriverMapsDirection";
import { AccountHeader } from "@/components/account/AccountHeader";

const AvaliableRides = () => {
  return (
    <div className="flex flex-col gap-5 p-6 overflow-auto">
      <AccountHeader heading="Active Rides" text="" className="" />

      <div className="p-5 rounded-md bg-white gap-5 flex flex-col">
        <CustomerDeliveries />
      </div>


      <DriverMapsDirection
        from="40.7590,-73.9845" // Times Square, NY
        waypoints={[
          [37.7749, -122.4194], // Silicon Valley, CA
          [31.9686, -99.9018], // Texas, USA
          [56.1304, -106.3468], // Canada
        ]}
      />
    </div>
  );
};

export default AvaliableRides;