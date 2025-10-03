import { ProfileComponent } from "@/components/account/ProfileComponent";
import { AddAccountInfo } from "../components/account/AddAccountInfo";
import { AddDeliveryAddress } from "../components/account/AddDeliveryAddress";
import { EditDeliveryAddress } from "../components/account/EditDeliveryAddress";
import Account from "../pages/Account";
import CheckoutSuccess from "../pages/account/CheckoutSuccess";
import LikedItems from "../pages/account/LikedItems";
import Notification from "../pages/account/Notification";
// import Order from "../pages/account/Order";
// import OrderHistory from "../pages/account/OrderHistory";
import { Profile } from "../pages/account/Profile";
import OrderHistory from "@/pages/account/OrderHistory";
import Order from "@/pages/account/Order";

export const accountRoute = {
  path: "account",
  element: <Account />,
  children: [
    {
      path: "",
      element: <ProfileComponent />,
    },
    {
      path: "profile",
      element: <Profile />,
      children: [
        {
          path: "",
          element: <ProfileComponent />,
        },
        {
          path: "edit-profile",
          element: <AddAccountInfo />,
        },
        {
          path: "add-new-address",
          element: <AddDeliveryAddress />,
        },
        {
          path: "edit-address/:id",
          element: <EditDeliveryAddress />,
        },
      ],
    },
    {
      path: "orders",
      element: <OrderHistory />,
    },
    {
      path: "checkout-successful",
      element: <CheckoutSuccess />,
    },
    {
      path: "orders/:id",
      element: <Order />,
    },
    {
      path: "liked-items",
      element: <LikedItems />,
    },
    {
      path: "notifications",
      element: <Notification />,
    },
  ],
};
