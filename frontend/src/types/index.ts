export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  specs: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  stock: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}
