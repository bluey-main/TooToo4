import { useEffect, useState } from "react";
import NewPagination from "../components/NewPagination";
import { useParams } from "react-router";
import { supabase } from "../lib/supabase";
import ProductCard from "@/components/ProductCard";
import ProductLoader from "@/components/ProductLoader";
import { IProduct } from "@/App";

function SearchProducts() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(id || "");

  const pageSize = 2;

  useEffect(() => {
    setSearchTerm(id || "");
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate total pages
  useEffect(() => {
    const calculateTotalPages = async () => {
      if (!searchTerm) {
        setTotalPages(0);
        setTotalItems(0);
        return;
      }
      try {
        const { count, error } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .or(`name.ilike.%${searchTerm}%,tags.cs.{"${searchTerm}"}`);

        if (error) throw error;

        const totalDocuments = count || 0;
        setTotalItems(totalDocuments);
        setTotalPages(Math.ceil(totalDocuments / pageSize));
      } catch (error) {
        console.error("Error calculating total pages:", error);
      }
    };

    calculateTotalPages();
  }, [searchTerm]);

  // Fetch paginated data
  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    if (!searchTerm) {
      setItems([]);
      setLoading(false);
      return;
    }

    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${searchTerm}%,tags.cs.{"${searchTerm}"}`)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setItems((data as IProduct[]) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, searchTerm]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <section className="px-2 sm:p-4 py-10">
      <div className="mb-4 flex justify-between items-center">
        <p className="xl:text-lg">
          <span>Home</span> <span className="text-xs">{">"}</span>{" "}
          <span className="font-medium">{id || ""}</span>
        </p>
        <p>
          {totalItems > 0 &&
            `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(
              currentPage * pageSize,
              totalItems
            )} of ${totalItems}`}
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or tag"
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      <div className="flex gap-4 text-sm xl:text-base">
        <div className="w-full py-4 px-3.5 bg-white rounded-lg">
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-[18px] rounded-lg">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductLoader key={index} />
              ))
            ) : items.length > 0 ? (
              items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center">
                <p>No Products Found</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <NewPagination
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchProducts;
