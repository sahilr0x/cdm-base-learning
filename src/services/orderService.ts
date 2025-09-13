export const verifyPayment = async () => {
  await new Promise((res) => setTimeout(res, 1000));
  return { status: "success" };
};
