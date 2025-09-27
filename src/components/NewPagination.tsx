import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useEffect, useState, FC } from "react";

interface NewPaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

const NewPagination: FC<NewPaginationProps> = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  const [visiblePages, setVisiblePages] = useState<(number | string)[]>([]);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Update visible pages based on the current page
  useEffect(() => {
    const pages: (number | string)[] = [];
    const siblingCount = 1;

    // Include first page
    if (currentPage > siblingCount + 2) {
      pages.push(1);
      if (currentPage > siblingCount + 3) {
        pages.push("...");
      }
    }

    // Add sibling pages
    for (
      let i = Math.max(1, currentPage - siblingCount);
      i <= Math.min(totalPages, currentPage + siblingCount);
      i++
    ) {
      pages.push(i);
    }

    // You can uncomment to include last page with ellipsis
    // if (currentPage < totalPages - siblingCount - 1) {
    //   if (currentPage < totalPages - siblingCount - 2) {
    //     pages.push("...");
    //   }
    //   pages.push(totalPages);
    // }

    setVisiblePages(pages);
  }, [currentPage, totalPages]);

  return (
    <ul className="mt-8 flex items-center justify-center gap-3 text-sm text-[#086047]">
      <li
        className={`px-3 py-2.5 flex items-center gap-1.5 xl:gap-2.5 text-xs bg-lightGray rounded-lg ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
      >
        <BsChevronLeft />
      </li>

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={index} style={{ margin: "0 5px" }}>
            ...
          </span>
        ) : (
          <li
            key={`page-${page}`}
            className={`px-3 py-1.5 rounded cursor-pointer ${
              currentPage === page ? "bg-[#086047] text-white" : ""
            }`}
            onClick={() => handlePageChange(Number(page))}
          >
            {page}
          </li>
        )
      )}

      <li
        className={`px-3 py-2.5 flex items-center gap-1.5 xl:gap-2.5 text-xs bg-lightGray rounded-lg ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={() =>
          currentPage < totalPages && handlePageChange(currentPage + 1)
        }
      >
        <BsChevronRight />
      </li>
    </ul>
  );
};

export default NewPagination;
