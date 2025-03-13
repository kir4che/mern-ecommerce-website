import { useState, useRef } from "react";

import { Product } from "@/types/product";
import { useAxios } from "@/hooks/useAxios";
import { useAlert } from "@/context/AlertContext";

import ProductForm from "@/components/organisms/ProductsManager/Form";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";

import { ReactComponent as EditIcon } from "@/assets/icons/edit.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";

interface ProductsManagerProps {
  products: Product[];
  refreshProducts: () => void;
}

// const initialFormData: Partial<Product> = {
//   title: "",
//   tagline: "",
//   categories: [],
//   description: "",
//   price: 0,
//   content: "",
//   expiryDate: "",
//   allergens: [],
//   delivery: "",
//   storage: "",
//   ingredients: "",
//   nutrition: "",
//   countInStock: 0,
//   tags: [],
//   imageUrl: ""
// };

const initialFormData: Partial<Product> = {
  title: "手工蜂蜜檸檬茶",
  tagline: "清爽解渴，純天然手工製作",
  categories: [],
  description: "使用100%天然蜂蜜與新鮮檸檬製成，無添加防腐劑。",
  price: 150,
  content: "500ml / 瓶",
  expiryDate: "常溫保存約3個月",
  allergens: ["蜂蜜"],
  delivery: "常溫配送",
  storage: "請置於陰涼處，開封後需冷藏",
  ingredients: "水、蜂蜜、檸檬汁",
  nutrition: "每100ml含熱量50大卡",
  countInStock: 20,
  tags: [],
  imageUrl: "https://via.placeholder.com/150"
};

const ProductsManager: React.FC<ProductsManagerProps> = ({ products, refreshProducts }) => {
  const { showAlert } = useAlert();

  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);
  const originalDataRef = useRef<Partial<Product>>({});

  // 重置表單
  const resetForm = () => {
    setFormData(initialFormData);
    originalDataRef.current = {};
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
      onError: () => showAlert({
        variant: "error",
        message: "新增商品失敗，請稍後再試。",
      })
    }
  ).refresh;

  const updateProduct = useAxios(params => `/products/${params?.id}`,
    { method: "PATCH", withCredentials: true },
    {
      immediate: false,
      onError: () => showAlert({
        variant: "error",
        message: "更新商品失敗，請稍後再試。",
      })
    }
  ).refresh;

  const deleteProduct = useAxios(params => `/products/${params?.id}`,
    { method: "DELETE", withCredentials: true },
    { 
      immediate: false,
      onError: () => showAlert({
        variant: "error",
        message: "刪除商品失敗，請稍後再試。",
      })
    }
  ).refresh

  const refreshProduct = useAxios(
    params => `/products/${params?.id}`,
    { withCredentials: true },
    { immediate: false }
  ).refresh;

  // 新增、更新、刪除商品
  const handleProduct = async (action: "add" | "update" | "delete", productData: Partial<Product>  & { _id?: string }) => {
    if ((action === "add" || action === "update") && !productData.imageUrl) {
      showAlert({
        variant: "error",
        message: "請上傳商品圖片",
      });

      return false;
    }

    // 驗證表單（新增、更新時）
    if (action === "add" || action === "update") {
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
      if (Object.keys(changedData).length === 0) return false;
      res = await updateProduct({ id: productData._id }, { data: changedData });
    } else if (action === "delete") {
      if (!productData._id) return;
      res = await deleteProduct({ id: productData._id });
    }
    if (res?.success) refreshProducts(); // 成功後重新取得商品列表
    return res?.success ?? false;
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
                  onClose={resetForm}
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
    </>
  );
}

export default ProductsManager;
