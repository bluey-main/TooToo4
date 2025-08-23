import { AccountHeader } from "@/components/account/AccountHeader";
import Vendors from "../../components/admin/Vendors";

const AdminCustomers = () => {
  return (
    <div className="flex flex-col gap-5 p-6 overflow-auto">
      <AccountHeader heading="Vendors" text="" className="" />

      <div className="p-5 rounded-md bg-white gap-5 flex flex-col">
        <Vendors/>
      </div>
    </div>
  );
};

export default AdminCustomers;
