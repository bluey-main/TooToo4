import { AccountHeader } from "@/components/account/AccountHeader";
import Customers from "../../components/admin/Customers";

const AdminCustomers = () => {
  return (
    <div className="flex flex-col gap-5 p-6 overflow-auto">
      <AccountHeader heading="Customers" text="" className="" />

      <div className="p-5 rounded-md bg-white gap-5 flex flex-col">
        <Customers/>
      </div>

    </div>
  );
};

export default AdminCustomers;
