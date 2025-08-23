import PropTypes from 'prop-types';

export const AccountButtonOutline = ({
  text = "Edit Profile",
  onClick = () => {},
  className = "",
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`bg-[#305C45] text-white rounded-md p-3 px-6 text-sm hover:bg-[#305c45c4] active:bg-[#305C45] ${className} disabled:opacity-50`}
      onClick={onClick}
    >
      {isLoading ? (
        <div
          className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

AccountButtonOutline.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export const AccountButtonFilled = ({
  text = "Edit Profile",
  onClick = () => {},
  className = "",
  isLoading = false,
}) => {
  return (
    <button
      className={`text-sm p-3 px-6 border rounded-md text-[#305C45] 
        border-[#305C45] hover:text-[#305c45b9] hover:border-[#305c45b9]
        active:text-[#305c45] active:border-[#305c45]
         ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div
          className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

AccountButtonFilled.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};