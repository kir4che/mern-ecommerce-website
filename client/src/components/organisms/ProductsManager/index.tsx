import { useState, useRef } from "react";

import { Product } from "@/types/product";
import { useAxios } from "@/hooks/useAxios";

import ProductForm from "@/components/organisms/ProductsManager/Form";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";

import { ReactComponent as EditIcon } from "@/assets/icons/edit.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";

interface ProductsManagerProps {
  products: Product[];
  refreshProducts: () => void;
}

const initialFormData: Partial<Product> = {
  title: "",
  tagline: "",
  categories: [],
  description: "",
  price: 0,
  content: "",
  expiryDate: "",
  allergens: [],
  delivery: "",
  storage: "",
  ingredients: "",
  nutrition: "",
  countInStock: 0,
  tags: [],
  imageUrl: ""
};

const ProductsManager: React.FC<ProductsManagerProps> = ({ products, refreshProducts }) => {
  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const originalDataRef = useRef<Partial<Product>>({});

  // 重置表單
  const resetForm = () => {
    setFormData(initialFormData);
    setFormKey((prev) => prev + 1);
  };

  // 過濾表單資料，移除空的欄位。
  const filterFormData = (data: Partial<Product>) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "" && value !== null)
    );
  };

  const addProduct = useAxios("/products",
    { method: "POST", withCredentials: true },
    {
      immediate: false,
      onError: () => setAlertMessages((prev) => [...prev, "新增商品失敗，請稍後再試。"])
    }
  ).refresh;
  const updateProduct = useAxios(params => `/products/${params?.id}`,
    { method: "PATCH", withCredentials: true },
    {
      immediate: false,
      onError: () => setAlertMessages((prev) => [...prev, "更新商品失敗，請稍後再試。"])
    }
  ).refresh;

  const deleteProduct = useAxios(params => `/products/${params?.id}`,
    { method: "DELETE", withCredentials: true },
    { 
      immediate: false,
      onError: () => setAlertMessages((prev) => [...prev, "刪除商品失敗，請稍後再試。"])
    }
  ).refresh

  const refreshProduct = useAxios(
    params => `/products/${params?.id}`,
    { withCredentials: true },
    { immediate: false }
  ).refresh;

  // 新增、更新、刪除商品
  const handleProduct = async (action: "add" | "update" | "delete", productData: Partial<Product> & { _id?: string }) => {
    setAlertMessages([]);

    // 驗證表單
    if (action !== "delete") {
      const form = document.getElementById("productForm") as HTMLFormElement;
      if (!form.reportValidity()) return false;
    }

    let res;
    if (action === "add") {
      const filteredData = filterFormData(productData);
      res = await addProduct(filteredData);
    } else if (action === "update") {
      const filteredData = filterFormData(productData);
      const changedData = Object.fromEntries(
        Object.entries(filteredData).filter(
          ([key, value]) => JSON.stringify(value) !== JSON.stringify(originalDataRef.current[key])
        )
      );
      if (Object.keys(changedData).length === 0) return;
      res = await updateProduct({ id: productData._id }, { data: changedData });
    } else if (action === "delete") {
      if (!productData._id) return;
      res = await deleteProduct({ id: productData._id });
    }

    refreshProducts();
    return res.success;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3>商品管理</h3>
        <Button
          onClick={() => (document.getElementById("addProductModal") as HTMLDialogElement).showModal()}
          className="h-9"
        >
          新增商品
        </Button>
        <Modal
          id="addProductModal"
          title="新增商品"
          confirmText="新增"
          onConfirm={() => handleProduct("add", formData)}
          onClose={resetForm}
          width="max-w-xl"
          isShowCloseIcon={true}
        >
          <ProductForm key={formKey} formData={formData} setFormData={setFormData} />
        </Modal>
      </div>
      {products?.length > 0 ? (
        <ul className="px-4 overflow-y-auto border shadow max-h-80">
          {products?.map((item) => (
            <li
              className="flex items-center justify-between py-3 border-b border-gray-300 border-dashed"
              key={item._id}
            >
              <p className="overflow-hidden truncate hover:opacity-80 whitespace-nowrap">{item.title} <span className="text-xs">({item.countInStock})</span></p>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button
                  variant="icon"
                  icon={EditIcon}
                  onClick={async () => {
                    const res = await refreshProduct({ id: item._id });
                    if (res?.product) {
                      setFormData(res.product);
                      originalDataRef.current = res.product;
                      setFormKey((prev) => prev + 1);
                      (document.getElementById(`updateProductModal-${item._id}`) as HTMLDialogElement).showModal();
                    }
                  }}
                  className="border-none h-fit"
                />
                <Modal
                  id={`updateProductModal-${item._id}`}
                  confirmText="更新"
                  onConfirm={() => handleProduct("update", formData)}
                  width="max-w-xl"
                  isShowCloseIcon={true}
                >
                  <ProductForm key={formKey} formData={formData} setFormData={setFormData} />
                </Modal>
                <Button
                  variant="icon"
                  icon={CloseIcon}
                  onClick={() => (document.getElementById(`deleteProductModal-${item._id}`) as HTMLDialogElement).showModal()}
                  className="border-none h-fit"
                />
                <Modal
                  id={`deleteProductModal-${item._id}`}
                  title="確定要刪除此商品嗎？"
                  confirmText="刪除"
                  onConfirm={() => handleProduct("delete", { _id: item._id })}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>尚無任何商品...</p>
      )}
      {alertMessages.length > 0 && 
        alertMessages.map((message, index) => (
          <Alert key={index} type="error" message={message} className="absolute z-50 -translate-x-1/2 left-1/2 w-fit top-16 text-nowrap"/>
        ))
      }
    </>
  );
}

export default ProductsManager;
