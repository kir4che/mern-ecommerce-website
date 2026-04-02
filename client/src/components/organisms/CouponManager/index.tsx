import { useMemo, useRef, useState } from "react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ManagerHeader from "@/components/molecules/ManagerHeader";
import ManagerTable, { TableColumn } from "@/components/molecules/ManagerTable";
import Modal, { type ModalRef } from "@/components/molecules/Modal";
import { useAlert } from "@/context/AlertContext";
import {
  useCreateCouponMutation,
  useDeactivateCouponMutation,
  useUpdateCouponMutation,
} from "@/store/slices/apiSlice";
import type { CouponItem, CreateCouponData, DiscountType } from "@/types";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";

import EditIcon from "@/assets/icons/edit.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

interface CouponManagerProps {
  coupons: CouponItem[];
}

type CouponStatus = "all" | "active" | "inactive" | "expired";
type CouponModalType = "create" | "edit" | "delete";

const INITIAL_FORM: CreateCouponData = {
  code: "",
  discountType: "percentage",
  discountValue: 0,
  minPurchaseAmount: 0,
  expiryDate: "",
};

const getCouponStatus = (coupon: CouponItem, now: Date) => {
  const expired = new Date(coupon.expiryDate).getTime() < now.getTime();
  if (!coupon.isActive) return "inactive";
  if (expired) return "expired";
  return "active";
};

const statusTextMap: Record<Exclude<CouponStatus, "all">, string> = {
  active: "啟用中",
  inactive: "已停用",
  expired: "已過期",
};

const toDateInputValue = (value: string) => {
  if (!value) return "";
  return value.includes("T") ? value.slice(0, 10) : value;
};

const toFormState = (coupon: CouponItem): CreateCouponData => ({
  code: coupon.code,
  discountType: coupon.discountType,
  discountValue: coupon.discountValue,
  minPurchaseAmount: coupon.minPurchaseAmount,
  expiryDate: toDateInputValue(coupon.expiryDate),
});

const isCouponPayloadChanged = (
  coupon: CouponItem,
  payload: CreateCouponData
) => {
  return (
    coupon.code !== payload.code ||
    coupon.discountType !== payload.discountType ||
    coupon.discountValue !== payload.discountValue ||
    coupon.minPurchaseAmount !== payload.minPurchaseAmount ||
    toDateInputValue(coupon.expiryDate) !== toDateInputValue(payload.expiryDate)
  );
};

const CouponManager = ({ coupons }: CouponManagerProps) => {
  const { showAlert } = useAlert();
  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouponStatus>("all");
  const [formData, setFormData] = useState<CreateCouponData>(INITIAL_FORM);
  const [modalType, setModalType] = useState<CouponModalType>("create");
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deactivateCoupon, { isLoading: isDeactivating }] =
    useDeactivateCouponMutation();

  const processedCoupons = useMemo(() => {
    const now = new Date();
    const keyword = searchKeyword.trim().toUpperCase();

    return coupons
      .filter((coupon) => {
        const status = getCouponStatus(coupon, now);
        const matchStatus = statusFilter === "all" || status === statusFilter;
        const matchKeyword = !keyword || coupon.code.includes(keyword);
        return matchStatus && matchKeyword;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [coupons, searchKeyword, statusFilter]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSelectedCoupon(null);
  };

  const handleSubmitCoupon = async () => {
    if (!formRef.current?.reportValidity()) return false;

    const discountValue = Number(formData.discountValue);
    const minPurchaseAmount = Number(formData.minPurchaseAmount || 0);

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      showAlert({
        variant: "error",
        message: "折扣數值必須大於 0。",
      });
      return false;
    }

    if (formData.discountType === "percentage" && discountValue > 100) {
      showAlert({
        variant: "error",
        message: "百分比折扣不可超過 100%。",
      });
      return false;
    }

    if (!Number.isFinite(minPurchaseAmount) || minPurchaseAmount < 0) {
      showAlert({
        variant: "error",
        message: "最低消費金額不可小於 0。",
      });
      return false;
    }

    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue,
        minPurchaseAmount,
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };

      if (modalType === "edit") {
        if (!selectedCoupon?._id) return false;

        if (!isCouponPayloadChanged(selectedCoupon, payload)) return true;

        await updateCoupon({
          id: selectedCoupon._id,
          data: { ...payload, isActive: selectedCoupon.isActive },
        }).unwrap();
        showAlert({
          variant: "success",
          message: `優惠碼 ${payload.code} 已更新。`,
        });
      } else {
        await createCoupon({
          ...payload,
          isActive: true,
        }).unwrap();
        showAlert({
          variant: "success",
          message: "優惠碼已建立。",
        });
      }

      resetForm();
      return true;
    } catch (err: unknown) {
      const fallbackMessage =
        modalType === "edit"
          ? "更新優惠碼失敗，請稍後再試。"
          : "新增優惠碼失敗，請稍後再試。";

      showAlert({
        variant: "error",
        message: getErrorMessage(err, fallbackMessage),
      });
      return false;
    }
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon?._id) return false;

    try {
      await deactivateCoupon(selectedCoupon._id).unwrap();
      showAlert({
        variant: "success",
        message: `已刪除優惠碼 ${selectedCoupon.code}`,
      });
      resetForm();
      return true;
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "刪除優惠碼失敗，請稍後再試。"),
      });
      return false;
    }
  };

  const openCreateModal = () => {
    resetForm();
    setModalType("create");
    modalRef.current?.showModal();
  };

  const openEditModal = (coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    setFormData(toFormState(coupon));
    setModalType("edit");
    modalRef.current?.showModal();
  };

  const openDeleteModal = (coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    setModalType("delete");
    modalRef.current?.showModal();
  };

  const columns: TableColumn<CouponItem>[] = [
    {
      key: "code",
      label: "優惠碼",
      render: (_, row) => <span className="font-semibold">{row.code}</span>,
      className: "min-w-32 whitespace-nowrap",
    },
    {
      key: "discountType",
      label: "折扣",
      render: (_, row) =>
        row.discountType === "percentage"
          ? `${row.discountValue}%`
          : `NT$ ${row.discountValue}`,
      className: "whitespace-nowrap",
    },
    {
      key: "minPurchaseAmount",
      label: "最低消費",
      render: (value) => `NT$ ${value}`,
      className: "whitespace-nowrap",
    },
    {
      key: "expiryDate",
      label: "到期日",
      render: (value) =>
        new Date(value as string).toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      className: "w-32 whitespace-nowrap",
    },
    {
      key: "isActive",
      label: "狀態",
      render: (_, row) => {
        const status = getCouponStatus(row, new Date());
        const colorMap = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          expired: "bg-yellow-100 text-yellow-800",
        } as const;

        return (
          <span
            className={cn("badge border-none badge-sm py-3", colorMap[status])}
          >
            {statusTextMap[status]}
          </span>
        );
      },
      className: "w-28 whitespace-nowrap",
    },
  ];

  return (
    <div className="space-y-3">
      <ManagerHeader
        title="優惠碼管理"
        searchValue={searchKeyword}
        onSearchChange={(value) => setSearchKeyword(value)}
        onAddClick={openCreateModal}
      >
        <Select
          name="coupon-status-filter"
          defaultText="所有狀態"
          value={statusFilter}
          options={[
            { label: "啟用中", value: "active" },
            { label: "已停用", value: "inactive" },
            { label: "已過期", value: "expired" },
          ]}
          onChange={(_, value) =>
            setStatusFilter(((value as string) || "all") as CouponStatus)
          }
        />
      </ManagerHeader>
      <ManagerTable
        columns={columns}
        data={processedCoupons}
        emptyMessage="尚未建立任何優惠碼"
        renderRowActions={(row) => (
          <div className="flex items-center gap-px">
            <Button
              variant="icon"
              icon={EditIcon}
              onClick={() => openEditModal(row)}
              className="rounded-full hover:bg-gray-50"
              aria-label="編輯優惠碼"
            />
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={() => openDeleteModal(row)}
              className="rounded-full text-red-600 hover:bg-red-50"
              aria-label="刪除優惠碼"
            />
          </div>
        )}
      />
      <Modal
        ref={modalRef}
        title={
          modalType === "edit"
            ? "編輯優惠碼"
            : modalType === "delete"
              ? `確定要刪除「優惠碼 ${selectedCoupon?.code ?? ""}」嗎？`
              : "新增優惠碼"
        }
        confirmText={
          modalType === "edit"
            ? isUpdating
              ? "更新中"
              : "更新"
            : modalType === "delete"
              ? isDeactivating
                ? "刪除中"
                : "刪除"
              : isCreating
                ? "新增中"
                : "新增"
        }
        onConfirm={
          modalType === "delete" ? handleDeleteCoupon : handleSubmitCoupon
        }
        disabled={isCreating || isUpdating || isDeactivating}
        onClose={resetForm}
        isShowCloseIcon={modalType !== "delete"}
        width={modalType === "delete" ? "max-w-md" : "max-w-xl"}
      >
        {modalType !== "delete" ? (
          <form ref={formRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label={
                formData.discountType === "percentage" ? "折扣 (%)" : "折扣金額"
              }
              value={formData.discountValue}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discountValue: Number(e.target.value),
                }))
              }
              min={0}
              step={formData.discountType === "percentage" ? "1" : "1"}
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
        ) : null}
      </Modal>
    </div>
  );
};

export default CouponManager;
