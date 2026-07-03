export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
  badge?: string;
};
