export interface CartProduct {
  id: string;
  sku: string;
  name: string;
  tags: string[];
  price: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
  stock_quantity: number;
  discount_rate: number;
  discounted_price: number;
  other_info: string;
  description: string;
  category_id: string;
  seller_id: string;
  created_at: string;   // ISO timestamp
  updated_at: string;   // ISO timestamp

  seller: {
    uid: string;
    email: string;
    phone_number: string;
    business_name: string;
  };

//   reviews: Review[]; // Define later if needed

  image_urls: {
    url: string;
    filename: string;
  }[];

  variations: {
    type: string;
    variation: string;
  }[];
}
