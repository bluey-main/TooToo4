// ProfileChecker.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function ProfileChecker({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && profile) {
      const requiredFields = ["first_name", "last_name"];
      const isIncomplete = requiredFields.some(
        (field) => !profile?.[field] || profile[field]?.toString().trim() === ""
      );

      if (isIncomplete && location.pathname !== "/account/profile/edit-profile") {
        navigate("/account/profile/edit-profile");
      }
    }
  }, [loading, profile, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
