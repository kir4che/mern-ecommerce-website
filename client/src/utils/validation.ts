export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "請輸入有效的 Email 地址";
  }
  return null;
};

export const validatePassword = (value: string): string | null => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(value)) {
    return "密碼需包含大小寫英文及數字，且至少 8 字元";
  }
  return null;
};
