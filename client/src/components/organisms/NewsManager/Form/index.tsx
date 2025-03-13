import ImageUploadInput from "@/components/molecules/ImageUploadInput";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

interface NewFormProps {
  formData: {
    title: string;
    imageUrl?: string;
    category: string;
    date: string;
    content: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    imageUrl?: string;
    category: string;
    date: string;
    content: string;
  }>>;
}

const NewForm: React.FC<NewFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form id="newsForm" className="py-2 space-y-4">
      <Input
        name="title"
        label="商品名稱"
        value={formData?.title}
        onChange={handleChange}
        required
      />
      <ImageUploadInput label="首圖上傳" setFormData={setFormData} />
      <Input
        label="首圖連結（上傳後會自動填入）"
        value={formData?.imageUrl}
        disabled
      />
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Input
          name="category"
          label="類別"
          placeholder="活動、告知"
          value={formData?.category}
          onChange={handleChange}
          required
          containerStyle="flex-1"
        />
        <Input
          name="date"
          label="日期"
          type="date"
          value={new Date(formData.date).toISOString().split("T")[0]}
          onChange={handleChange}
          required
          containerStyle="flex-1"
        />
      </div>
      <Textarea
        name="content"
        label="內容"
        value={formData?.content}
        rows={8}
        onChange={handleChange}
        required
        helperText="請使用 Markdown 語法"
      />
    </form>
  );
};

export default NewForm;
