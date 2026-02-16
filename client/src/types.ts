export interface Product {
  handle: string;
  title: string;
  price: string;
  imageSrc: string;
  body: string;
  category: string;
}

export interface CsvProduct {
  Handle: string;
  Title: string;
  "Variant Price": string;
  "Image Src": string;
  "Body (HTML)": string;
  "Product Category": string;
}

// Map CSV handles to the image slugs used in the attached assets
export const PRODUCT_SLUG_MAPPING: Record<string, string> = {
  "blue-design-kurti": "blue-kurti",
  "mens-casual-wear-example-product-1": "blue-jacket",
  "mens-casual-wear-example-product-4": "grey-hoodie",
  "mens-casual-wear-example-product-5": "white-tshirt",
  "red-t-shirt": "red-tshirt",
};
