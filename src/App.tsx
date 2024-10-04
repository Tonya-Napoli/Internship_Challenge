import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import './index.css';
// import needed mock API functions
import { fetchUsers, fetchProducts, fetchPrices } from './mock_api';

//Defining TypeScript types for the API data structures to prevent undefined comparisons
interface User {
  userId: number;
  userType: string;
  userInfo: {
    name: string;
  };
  metadata: {
    accessLevel: number;
  };
}

interface Product {
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  default_price: string;
  description: string;
  images: any[];
  livemode: boolean;
  marketing_features: any[];
  metadata: object;
  name: string;
  tax_code: string;
  type: string;
  updated: number;
  url: string | null;
  price?: string; //price property to hold formatted price
}

interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  livemode: boolean;
  lookup_key: string | null;
  metadata: object;
  nickname: string | null;
  product: string;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}
function App() {
  // Using the mock API functions, create a function to be used on the front end that 
  // 1.) fetches users from API
  // 2.) sort users alphabetically by last name
  // 3.) display the sorted Users

  // State management to store the sorted users and lists of products wtih prices. Specifying exptected types using the generic form of useState
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [productsWithPrices, setProductsWithPrices] = useState<Product[]>([]);

  // Using the mock API functions, create a function to be used on the front end that 
  // 1.) fetches products from API
  // 2.) fetches prices from the API
  // 3.) add price to correct product
  // 4.) display product name & price

  //consolidated function to fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [users, products, prices] = await Promise.all([fetchUsers(), fetchProducts(), fetchPrices()]);
      setSortedUsers(sortUsersByLastName(users));
      setProductsWithPrices(combineProductsAndPrices(products, prices));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  //function to sort users by last name
  const sortUsersByLastName = (users: User[]): User[] => {
      return users.sort((a,b) => {
        const aLastName = a.userInfo.name.split(" ").pop() ?? "";
        const bLastName = b.userInfo.name.split(" ").pop() ?? "";
        return aLastName.localeCompare(bLastName);
      });
  };

  //Function to map prices to products
  const combineProductsAndPrices = (products: Product[], prices: Price[]): Product[] => {
    return products.map((product) => {
      const price = prices.find((price) => price.product === product.id);
      return {
        ...product,
        price: price ? (price.unit_amount / 100).toFixed(2) : 'N/A',
      };
    });
  };

// UseEffect to call functions on component load
useEffect(() => {
  fetchData();//fetching data when component mounts
}, [fetchData]);

return (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">API Data Display</h1>

      <section className="App-section">
        <h2>Sorted Users</h2>
        <ul className="user-list">
          {sortedUsers.map((user) => (
            <li key={user.userId} className="user-item">
              {user.userInfo.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="App-section">
        <h2>Products with Prices</h2>
        <ul className="product-list">
          {productsWithPrices.map((product) => (
            <li key={product.id} className="product-item">
              {product.name}: ${product.price}
            </li>
          ))}
        </ul>
      </section>
    </header>
  </div>
);
}

export default App;
