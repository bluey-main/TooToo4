import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const updateSearchKeywords = async (): Promise<void> => {
  try {
    const { data: products, error } = await supabase.from("products").select("id, name");

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      console.log("No documents found.");
      return;
    }

    const batchUpdates = products.map(async (product) => {
      const name = product.name || "";

      const cleanName = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const words = cleanName.split(" ");

      const searchKeywords = [
        ...new Set(words.filter((word: string) => word.length > 0)),
      ];

      const { error: updateError } = await supabase
        .from("products")
        .update({ searchKeywords, cleanName })
        .eq("id", product.id);

      if (updateError) {
        throw updateError;
      }

      console.log(
        `Updated document ${product.id} with searchKeywords:`,
        searchKeywords
      );
    });

    await Promise.all(batchUpdates);
    toast.success("All documents updated successfully.");
    console.log("All documents updated successfully.");
  } catch (error) {
    toast.error(`Error updating documents: ${error}`);
    console.error("Error updating documents:", error);
    throw error; 
  }
};

export const addAllProductNames = async (): Promise<void> => {
  try {
    const { data: products, error } = await supabase.from("products").select("lowercaseName");

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      console.log("No documents found.");
      return;
    }

    const productNames: string[] = products.map((product) => product.lowercaseName);
    console.log(productNames);

    const { error: upsertError } = await supabase
      .from("options")
      .upsert({ id: "allProductNames", productNames }, { onConflict: "id" });

    if (upsertError) {
      throw upsertError;
    }

    toast.success("Product names added successfully.");
    console.log("Product names added successfully.");
  } catch (error) {
    console.error("Error getting documents:", error);
    toast.error(`Error getting documents: ${error}`);
  }
};

export const addCategoryCount = async (): Promise<void> => {
  try {
    const { data: products, error } = await supabase.from("products").select("category");

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      console.log("No documents found.");
      return;
    }

    const categoryCounts: Record<string, number> = {};

    products.forEach((product) => {
      const category: string = product.category || "Uncategorized";

      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    const { error: upsertError } = await supabase
      .from("categoryCounts")
      .upsert({ id: "categoryCounts", ...categoryCounts }, { onConflict: "id" });

    if (upsertError) {
      throw upsertError;
    }

    toast.success("Category counts added successfully.");
    console.log("Category counts added successfully.");
  } catch (error) {
    toast.error(`Error getting documents: ${error}`);
    console.error("Error getting documents:", error);
  }
};

export const addLowerCaseNamesToProducts = async (): Promise<void> => {
    try {
      const { data: products, error } = await supabase.from("products").select("id, name");

      if (error) {
        throw error;
      }

      if (!products || products.length === 0) {
        console.log("No documents found.");
        return;
      }

      const batchUpdates = products.map(async (product) => {
        if (product.name) {
          const lowercaseName = product.name.toLowerCase();
          const { error: updateError } = await supabase
            .from("products")
            .update({ lowercaseName })
            .eq("id", product.id);

          if (updateError) {
            throw updateError;
          }
          console.log(`Updated document ${product.id}`);
        } else {
          console.log(`Document ${product.id} does not have a 'name' field.`);
        }
      });

      await Promise.all(batchUpdates);
      toast.success("All documents updated successfully.");
      console.log("All documents updated successfully.");
    } catch (error) {
      console.error("Error updating documents:", error);
      toast.error(`Error updating documents: ${error}`);
    }
  };