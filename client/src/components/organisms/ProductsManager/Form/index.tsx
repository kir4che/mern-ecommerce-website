import ImageUploadInput from "@/components/molecules/ImageUploadInput";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const ProductForm = ({ formData, setFormData }) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    selectedOptions?: string[],
  ) => {
    const { name, value } = e.target;

    // 根據不同的欄位更新 formData，若是多選則處理為 Array。
    setFormData((prev) => ({
      ...prev,
      [name]:
        selectedOptions ||
        (Array.isArray(prev[name])
          ? value.split(",").map((v) => v.trim())
          : value),
    }));
  };

  return (
    <form id="productForm" className="py-2 space-y-4">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <div className="flex flex-col justify-between grow">
          <Input
            name="title"
            label="商品名稱"
            value={formData?.title}
            onChange={handleChange}
            required
          />
          <Input
            name="tagline"
            label="標語"
            value={formData?.tagline}
            onChange={handleChange}
          />
        </div>
        <Select
          name="categories"
          label="分類"
          value={formData?.categories}
          options={[
            { value: "麵包", label: "麵包" },
            { value: "蛋糕", label: "蛋糕" },
            { value: "餅乾", label: "餅乾" },
            { value: "其他", label: "其他" },
          ]}
          onChange={handleChange}
          multiple
          required
        />
      </div>
      <ImageUploadInput label="商品圖片上傳" setFormData={setFormData} />
      <Input
        label="商品圖連結（上傳後會自動填入）"
        value={formData?.imageUrl}
        required
        disabled
      />
      <Textarea
        name="description"
        label="敘述"
        value={formData?.description}
        onChange={handleChange}
        required
      />
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Input
          name="price"
          type="number"
          label="價格"
          value={formData?.price}
          min={0}
          onChange={handleChange}
          required
          containerStyle="flex-1"
          numberStyle="h-10"
        />
        <Input
          name="countInStock"
          label="庫存數量"
          type="number"
          value={formData?.countInStock}
          onChange={handleChange}
          containerStyle="flex-1"
          numberStyle="h-10"
        />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Input
          name="content"
          label="內容"
          placeholder="內含 2 入"
          value={formData?.content}
          onChange={handleChange}
          required
          containerStyle="flex-1"
        />
        <Input
          name="expiryDate"
          label="有效期限"
          placeholder="常溫保存 3 天"
          value={formData?.expiryDate}
          onChange={handleChange}
          containerStyle="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Input
          name="allergens"
          label="過敏原"
          placeholder="小麥, 乳製品, 蛋"
          value={formData?.allergens}
          onChange={handleChange}
          containerStyle="grow"
        />
        <Select
          name="delivery"
          label="配送資訊"
          value={formData?.delivery}
          defaultText="請選擇配送方式"
          options={[
            { value: "常溫宅配", label: "常溫宅配" },
            { value: "低溫宅配", label: "低溫宅配" },
          ]}
          onChange={handleChange}
        />
      </div>
      <Input
        name="storage"
        label="保存方式"
        placeholder="請保存於陰涼處，避免高溫或陽光照射。"
        value={formData?.storage}
        onChange={handleChange}
      />
      <Input
        name="ingredients"
        label="成分"
        placeholder="小麥粉、牛奶、無鹽奶油、蛋..."
        value={formData?.ingredients}
        onChange={handleChange}
      />
      <Input
        name="nutrition"
        label="營養資訊"
        placeholder="（每100g）能量180kcal，蛋白質5.0g，脂肪2.5g，碳水化合物35.0g，食鹽相當量0.5g"
        value={formData?.nutrition}
        onChange={handleChange}
      />
      <Input
        name="tags"
        label="標籤"
        placeholder="推薦,熱銷,新品,特價"
        value={formData?.tags?.join(",")}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            tags: e.target.value.split(",").map((item) => item.trim()),
          }))
        }
      />
    </form>
  );
};

export default ProductForm;
