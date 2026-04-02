import Button from "@/components/atoms/Button";
import ImageUploadInput from "@/components/atoms/ImageUploadInput";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { NEWS_FORM_TEST_DATA } from "@/constants/data";
import type { NewsItem } from "@/types";

interface NewFormProps {
  ref?: React.Ref<HTMLFormElement>;
  formData: Partial<NewsItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<NewsItem>>>;
}

const NewForm = ({ formData, setFormData, ref }: NewFormProps) => {
  const fillTestData = () => {
    setFormData((prev) => ({
      ...prev,
      ...NEWS_FORM_TEST_DATA,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form ref={ref} className="py-2 space-y-3">
      <Input
        name="title"
        label="標題"
        value={formData?.title || ""}
        onChange={handleChange}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          name="category"
          label="分類"
          value={formData?.category || ""}
          onChange={handleSelectChange}
          required
          options={[
            { label: "活動", value: "活動" },
            { label: "公告", value: "公告" },
            { label: "新聞", value: "新聞" },
          ]}
        />
        <Input
          name="date"
          label="發佈日期"
          type="date"
          value={
            formData.date
              ? new Date(formData.date).toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          required
        />
      </div>
      <ImageUploadInput label="首圖上傳" setFormData={setFormData} />
      <Textarea
        name="content"
        label="內容"
        value={formData?.content || ""}
        rows={20}
        onChange={handleChange}
        required
        helperText="支援 Markdown 語法"
      />
      <div className="flex justify-end pt-1">
        <Button variant="outline" onClick={fillTestData}>
          貼上測試資料
        </Button>
      </div>
    </form>
  );
};

export default NewForm;
