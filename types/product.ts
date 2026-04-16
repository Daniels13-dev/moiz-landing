export interface CatalogProductVariant {
  id: string;
  name: string;
  price: number | null;
  image: string | null;
  color?: string | null;
  size?: string | null;
  stock: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  description: string;
  category: string;
  petType: string;
  rating: number;
  isNew?: boolean;
  isFeatured?: boolean;
  allowSubscription?: boolean;
  stock?: number;
  variants?: CatalogProductVariant[];
}

export interface ProductVariant extends CatalogProductVariant {}
