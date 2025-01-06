interface AddToCartParams {
  productId: string;
  quantity: number;
}
  
export const handleAddToCart = async (
  product: { _id: string; countInStock: number } | null,
  quantity: number,
  addToCart: (params: AddToCartParams) => Promise<void>,
  setQuantity: (value: number) => void
) => {
  if (!product) return;

  try {
    await addToCart({ productId: product._id, quantity: quantity || 1 });
    if (product.countInStock > 0) setQuantity(1);
    else setQuantity(0);
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};

export const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['.', ',', '-', 'e'].includes(e.key)) {
    e.preventDefault();
  }
};

export const handleQuantityChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  product: { _id: string; countInStock: number } | null,
  setQuantity: (value: number) => void
) => {
  let inputValue = e.target.value.replace(/^0+(?!$)/, '');
  e.target.value = inputValue;

  let newQuantity = parseInt(inputValue, 10);
  if (isNaN(newQuantity)) return;

  if (newQuantity < 1) newQuantity = 1;
  else if (newQuantity > (product?.countInStock || Infinity)) {
    newQuantity = product?.countInStock || 1;
  }

  setQuantity(newQuantity);
}
