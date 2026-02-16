import Papa from "papaparse";
import { Product, CsvProduct } from "../types";

export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse("/product_export.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data as CsvProduct[];
        // Filter out empty rows or rows without handles
        // Also dedup by handle since the CSV has multiple rows per product (for images/variants)
        const productsMap = new Map<string, Product>();

        data.forEach((row) => {
          if (row.Handle && !productsMap.has(row.Handle)) {
            productsMap.set(row.Handle, {
              handle: row.Handle,
              title: row.Title,
              price: row["Variant Price"],
              imageSrc: row["Image Src"],
              body: row["Body (HTML)"],
              category: row["Product Category"],
            });
          }
        });

        resolve(Array.from(productsMap.values()));
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
