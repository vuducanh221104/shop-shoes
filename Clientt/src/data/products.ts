export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    id: "sneaker",
    name: "Sneaker",
    products: [
      {
        id: "sneaker-1",
        name: "Nike Air Max",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "sneaker"
      },
      {
        id: "sneaker-2",
        name: "Adidas Ultraboost",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        category: "sneaker"
      },
      {
        id: "sneaker-3",
        name: "Puma RS-X",
        price: 950000,
        image: "https://images.unsplash.com/photo-1608379743498-53e79f1164d6",
        category: "sneaker"
      },
      {
        id: "sneaker-4",
        name: "New Balance 574",
        price: 1350000,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570",
        category: "sneaker"
      }
    ]
  },
  {
    id: "boot",
    name: "Boot",
    products: [

      {
        id: "boot-2",
        name: "Dr. Martens 1460",
        price: 1950000,
        image: "https://images.unsplash.com/photo-1610398752800-146f269dfcc8",
        category: "boot"
      },
      {
        id: "boot-3",
        name: "Caterpillar Colorado",
        price: 1850000,
        image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76",
        category: "boot"
      },
      {
        id: "boot-4",
        name: "Red Wing Iron Ranger",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0",
        category: "boot"
      }
    ]
  },
  {
    id: "sandal",
    name: "Sandal",
    products: [
      {
        id: "sandal-1",
        name: "Birkenstock Arizona",
        price: 850000,
        image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33",
        category: "sandal"
      },
      {
        id: "sandal-2",
        name: "Teva Original",
        price: 750000,
        image: "https://images.unsplash.com/photo-1564482565083-32b504e9d4f2",
        category: "sandal"
      },
      {
        id: "sandal-3",
        name: "Crocs Classic",
        price: 650000,
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306",
        category: "sandal"
      },
      {
        id: "sandal-4",
        name: "Havaianas Slim",
        price: 450000,
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306",
        category: "sandal"
      }
    ]
  },
  {
    id: "running",
    name: "Running",
    products: [
      {
        id: "running-1",
        name: "Nike Zoom Pegasus",
        price: 1650000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "running"
      },
      {
        id: "running-2",
        name: "Adidas Ultraboost 22",
        price: 1950000,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        category: "running"
      },
      {
        id: "running-3",
        name: "Asics Gel-Kayano",
        price: 1750000,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        category: "running"
      },
      {
        id: "running-4",
        name: "Brooks Ghost 14",
        price: 1850000,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
        category: "running"
      }
    ]
  }
]; 