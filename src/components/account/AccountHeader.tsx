import { BsChevronLeft } from "react-icons/bs";
import { useNavigate } from "react-router";
import React from "react";

interface AccountHeaderProps {
  heading?: string;
  text?: string;
  className?: string;
  hasBack?: boolean;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  heading = "Hello, Marvellous Richard",
  text = "07087562892 l mamihub@gmail.com",
  className = "",
  hasBack = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {hasBack && (
        <BsChevronLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
          size={25}
        />
      )}
      <div>
        <h1 className="text-[24px] md:text-3xl font-bold">{heading}</h1>
        {text !== "" && (
          <p className="text-sm md:text-base opacity-60 mt-2">{text}</p>
        )}
      </div>
    </div>
  );
};
