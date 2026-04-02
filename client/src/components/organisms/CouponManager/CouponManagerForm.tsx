import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import type { CreateCouponData, DiscountType } from "@/types";

interface CouponFormProps {
  ref?: React.Ref<HTMLFormElement>;
  formData: CreateCouponData;
  setFormData: React.Dispatch<React.SetStateAction<CreateCouponData>>;
}

const CouponForm = ({ formData, setFormData, ref }: CouponFormProps) => {
  return (
    <form ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="優惠碼"
        value={formData.code}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            code: e.target.value.toUpperCase(),
          }))
        }
        placeholder="ex. MARCH10"
        required
      />
      <Select
        name="discountType"
        label="折扣類型"
        value={formData.discountType}
        options={[
          { label: "百分比", value: "percentage" },
          { label: "固定金額", value: "fixed" },
        ]}
        onChange={(_, value) =>
          setFormData((prev) => ({
            ...prev,
            discountType: value as DiscountType,
          }))
        }
      />
      <Input
        type="number"
        label={formData.discountType === "percentage" ? "折扣 (%)" : "折扣金額"}
        value={formData.discountValue}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            discountValue: Number(e.target.value),
          }))
        }
        min={0}
        step={1}
        required
      />
      <Input
        type="number"
        label="最低消費金額"
        value={formData.minPurchaseAmount}
        step={5}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            minPurchaseAmount: Number(e.target.value),
          }))
        }
        min={0}
      />
      <Input
        type="date"
        label="到期日"
        value={formData.expiryDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
        }
        className="md:col-span-2"
        required
      />
    </form>
  );
};

export default CouponForm;
