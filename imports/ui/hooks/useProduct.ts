import { useState, useEffect } from "react";
import { productsSingle } from "/imports/api/methods/products";
import type { Product } from "/imports/api/collections/products";

export const PRODUCT_QUERY = "product";

export const useProduct = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    productsSingle({ id })
      .then((result) => {
        setProduct(result);
      })
      .catch((err) => {
        setError(err);
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { data: product, isLoading, error };
};
