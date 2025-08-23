import { AccountHeader } from "@/components/account/AccountHeader";

const Notification = () => {
  return (
    <div className="bg-white w-full">
      <div className="  px-4 py-5 sm:px-6 ">
        <AccountHeader
          heading=" Notifications"
          text="View Notifications or your orders and much more here."
        />
      </div>
    </div>
  );
};

export default Notification;