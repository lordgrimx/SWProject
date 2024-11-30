export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'house' | 'apartment' | 'villa';
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  features: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
}
