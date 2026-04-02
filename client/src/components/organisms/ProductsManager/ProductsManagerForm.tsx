import Button from "@/components/atoms/Button";
import ImageUploadInput from "@/components/atoms/ImageUploadInput";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { PRODUCT_CATEGORIES } from "@/constants/actionTypes";
import { PRODUCT_FORM_TEST_DATA } from "@/constants/data";
import type { Product } from "@/types";

type ProductFormData = Partial<Product>;

interface ProductFormProps {
  ref?: React.Ref<HTMLFormElement>;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const ProductForm = ({ formData, setFormData, ref }: ProductFormProps) => {
  const fillTestData = () => {
    setFormData((prev) => ({
      ...prev,
      ...PRODUCT_FORM_TEST_DATA,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(prev[name as keyof ProductFormData])
        ? value.split(",").map((v) => v.trim())
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <form ref={ref} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="title"
          label="商品名稱"
          value={formData?.title}
          onChange={handleInputChange}
          required
        />
        <Input
          name="tagline"
          label="標語"
          value={formData?.tagline}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          name="categories"
          label="分類"
          value={formData?.categories}
          options={PRODUCT_CATEGORIES.map((cat) => ({
            label: cat.label,
            value: cat.value,
          }))}
          optionsContainerClassName="grid grid-cols-2 gap-2"
          onChange={handleSelectChange}
          multiple
          required
        />
        <Input
          name="tags"
          label="標籤"
          placeholder="推薦, 熱銷, 新品, 特價"
          value={formData?.tags?.join(",")}
          onChange={handleTagsChange}
          helperText="用「逗號」分隔"
        />
      </div>
      <ImageUploadInput label="商品圖片上傳" setFormData={setFormData} />
      <Input
        label="商品圖連結"
        value={formData?.imageUrl}
        required
        disabled
        helperText="上傳後會自動填入"
      />
      <Textarea
        name="description"
        label="商品敘述"
        value={formData?.description}
        onChange={handleInputChange}
        required
        rows={3}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="content"
          label="內容規格"
          placeholder="內含 2 入"
          value={formData?.content}
          onChange={handleInputChange}
          required
          helperText="ex. 內含數量、重量等"
        />
        <Input
          name="expiryDate"
          label="有效期限"
          placeholder="常溫保存 3 天"
          value={formData?.expiryDate}
          onChange={handleInputChange}
          helperText="保存期限或賞味期限"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="price"
          type="number"
          label="商品價格"
          value={formData?.price}
          min={0}
          step={0.01}
          onChange={handleInputChange}
          required
        />
        <Input
          name="countInStock"
          label="庫存數量"
          type="number"
          value={formData?.countInStock}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            name="delivery"
            label="配送資訊"
            value={formData?.delivery}
            defaultText="請選擇配送方式"
            options={[
              { value: "常溫宅配", label: "常溫宅配" },
              { value: "低溫宅配", label: "低溫宅配" },
            ]}
            onChange={handleSelectChange}
          />
        </div>
        <Input
          name="storage"
          label="保存方式"
          placeholder="請保存於陰涼處..."
          value={formData?.storage}
          onChange={handleInputChange}
        />
      </div>
      <Input
        name="allergens"
        label="過敏原"
        placeholder="小麥, 乳製品, 蛋"
        value={formData?.allergens?.join(", ")}
        onChange={handleInputChange}
        helperText="用「逗號」分隔，標示含有的過敏原。"
      />
      <Input
        name="ingredients"
        label="成分"
        placeholder="小麥粉、牛奶、無鹽奶油、蛋..."
        value={formData?.ingredients}
        onChange={handleInputChange}
      />
      <Textarea
        name="nutrition"
        label="營養資訊"
        placeholder="（每100g）能量180kcal，蛋白質5.0g..."
        value={formData?.nutrition}
        onChange={handleInputChange}
        rows={1}
      />
      <div className="flex justify-end pt-2">
        <Button variant="outline" onClick={fillTestData}>
          貼上測試資料
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
