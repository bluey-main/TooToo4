import { useEffect, useState } from "react";
import NewPagination from "../components/NewPagination";
// import FilterSidebar from "../components/categories/Sidebar";
import { numberWithCommas } from "../utils/helper";
import { useParams } from "react-router";
// import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import ProductLoader from "@/components/ProductLoader";

// Define product type
interface Product {
  id: string;
  name: string;
  imageUrls: string[];
  category: string;
  price: number;
  discountedPrice: number;
  discountRate: string;
}

function SearchProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastDocs, setLastDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const { id } = useParams<{ id: string }>();
  const { allProducts } = useAuth(); // Assuming this is typed elsewhere

  const pageSize = 102;

  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  useEffect(() => {
    const calculateTotalPages = async () => {
      try {
        const lowercasedId = id?.toLowerCase() || "";

        const { count: nameCount, error: nameError } = await supabase
          .from("products")
          .select("id", { count: "exact" })
          .ilike("name", `%${lowercasedId}%`);

        const { count: tagsCount, error: tagsError } = await supabase
          .from("products")
          .select("id", { count: "exact" })
          .contains("tags", [lowercasedId]);

        const { count: keywordsCount, error: keywordsError } = await supabase
          .from("products")
          .select("id", { count: "exact" })
          .contains("searchKeywords", [lowercasedId]);

        if (nameError || tagsError || keywordsError) {
          throw nameError || tagsError || keywordsError;
        }

        const totalDocuments = (nameCount || 0) + (tagsCount || 0) + (keywordsCount || 0);
        const totalPages = Math.ceil(totalDocuments / pageSize);

        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error calculating total pages:", error);
      }
    };

    calculateTotalPages();
  }, [id]);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);

    const lowercasedId = id?.toLowerCase() || "";
    const itemsPerPage = pageSize;

    try {
      const from = (pageNumber - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data: nameResults, error: nameError } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${lowercasedId}%`)
        .range(from, to);

      const { data: tagsResults, error: tagsError } = await supabase
        .from("products")
        .select("*")
        .contains("tags", [lowercasedId])
        .range(from, to);

      const { data: keywordsResults, error: keywordsError } = await supabase
        .from("products")
        .select("*")
        .contains("searchKeywords", [lowercasedId])
        .range(from, to);

      if (nameError || tagsError || keywordsError) {
        throw nameError || tagsError || keywordsError;
      }

      const allResults = [...(nameResults || []), ...(tagsResults || []), ...(keywordsResults || [])];
      const uniqueResults = allResults.filter(
        (item, index, self) => index === self.findIndex((v) => v.id === item.id)
      );

      setItems(uniqueResults as Product[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, id, searchTerm]);

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
        <p>{`Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(
          currentPage * pageSize,
          items.length
        )} of ${items.length}`}</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name"
          className="border rounded px-4 py-2"
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
                <ProductCard
                  id={product.id}
                  name={product.name}
                  key={product.id}
                  image={product.imageUrls}
                  category={product.category}
                  price={numberWithCommas(product.discountedPrice)}
                  discount={product.discountRate}
                  slashedPrice={numberWithCommas(product.price)}
                />
              ))
            ) : (
              <div className="col-span-4 text-center bg-red-0">
                <p>No Products Found</p>
              </div>
            )}
          </div>

          <NewPagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      </div>
    </section>
  );
}

export default SearchProducts;
