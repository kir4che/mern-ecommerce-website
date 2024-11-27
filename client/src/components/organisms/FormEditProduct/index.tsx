import { Dialog } from "@headlessui/react";
import InputWithLabel from "@/components/atoms/Input";

const ProductEditForm = ({
  isAddOrEdit,
  setIsAddOrEdit,
  form,
  setForm,
  handleFormUpdate,
}) => {
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue: string | number = value;

    if (name === "price" || name === "countInStock")
      updatedValue = parseInt(value);
    if (name === "allergens" && typeof updatedValue === "string")
      setForm({ ...form, allergens: updatedValue.split(",") });
    else if (name === "categories")
      setForm({ ...form, categories: [updatedValue] });
    else setForm({ ...form, [name]: updatedValue });
  };

  return (
    <Dialog
      open={isAddOrEdit === "edit" || isAddOrEdit === "add"}
      className="relative z-50"
      onClose={() => {}}
    >
      <div className="fixed inset-0 flex items-center justify-center w-screen bg-primary/5">
        <Dialog.Panel className="max-w-lg p-4 overflow-y-auto bg-white rounded-md max-h-[80%]">
          <Dialog.Title className="flex items-center justify-between pb-2 border-b border-gray-300">
            編輯商品資訊
            <button
              className="hover:opacity-60"
              onClick={() => setIsAddOrEdit("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
              </svg>
            </button>
          </Dialog.Title>
          <Dialog.Description className="py-4 space-y-2 text-sm">
            <div className="flex gap-4">
              <InputWithLabel
                text="標題"
                name="title"
                value={form.title}
                onChange={handleFormChange}
              />
              <label className="block w-1/3">
                分類
                <select
                  name="categories"
                  value={form.categories}
                  className="px-1 min-h-[2.5rem]"
                  onChange={handleFormChange}
                >
                  <option value="麵包">麵包</option>
                  <option value="蛋糕">蛋糕</option>
                  <option value="甜點">餅乾</option>
                  <option value="飲品">其他</option>
                </select>
              </label>
            </div>
            <div className="flex gap-4">
              <InputWithLabel
                text="價格"
                type="number"
                name="price"
                value={form.price}
                onChange={handleFormChange}
              />
              <InputWithLabel
                text="庫存數量"
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleFormChange}
              />
            </div>
            <InputWithLabel
              text="標語"
              name="tagline"
              value={form.tagline}
              onChange={handleFormChange}
            />
            <label className="block">
              簡介
              <textarea
                name="description"
                value={form.description}
                rows={4}
                onChange={handleFormChange}
              />
            </label>
            <div className="flex gap-4">
              <InputWithLabel
                text="內容物"
                name="content"
                value={form.content}
                onChange={handleFormChange}
              />
              <InputWithLabel
                text="過敏原"
                name="allergens"
                value={form.allergens}
                onChange={handleFormChange}
                placeholder="小麥,乳製品,蛋"
              />
            </div>
            <InputWithLabel
              text="成分"
              name="ingredients"
              value={form.ingredients}
              onChange={handleFormChange}
              placeholder="小麥粉、牛奶、無鹽奶油、蛋..."
            />
            <InputWithLabel
              text="營養成分"
              name="nutrition"
              value={form.nutrition}
              onChange={handleFormChange}
              placeholder="（每100g）能量180kcal，蛋白質5.0g，脂肪2.5g，碳水化合物35.0g，食鹽相當量0.5g"
            />
            <label className="block">
              運送方式
              <select
                name="delivery"
                value={form.delivery}
                className="px-1"
                onChange={handleFormChange}
              >
                <option value="常溫宅配">常溫宅配</option>
                <option value="低溫宅配">低溫宅配</option>
              </select>
            </label>
            <InputWithLabel
              text="有效期限"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleFormChange}
              placeholder="常溫保存3天，冷藏可延長效期約5天。"
            />
            <label className="block">
              保存方式
              <select
                name="storage"
                value={form.storage}
                className="px-1"
                onChange={handleFormChange}
              >
                <option value="請保存於陰涼處，避免高溫或陽光照射。">
                  請保存於陰涼處，避免高溫或陽光照射。
                </option>
                <option value="請保存於陰涼處，避免高溫或陽光照射，亦可冷藏保存。">
                  請保存於陰涼處，避免高溫或陽光照射，亦可冷藏保存。
                </option>
              </select>
            </label>
            <InputWithLabel
              text="圖片網址"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleFormChange}
              placeholder="http://xxx.jpg"
            />
          </Dialog.Description>
          <div className="ml-auto text-sm w-fit">
            <button
              className="px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => handleFormUpdate("products", "edit")}
            >
              確定變更
            </button>
            <button
              className="px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => setIsAddOrEdit("")}
            >
              取消
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProductEditForm;
