export const verifyPayment = async () => {
  await new Promise((res) => setTimeout(res, 1000));
  if (Math.random() > 0.9) throw new Error("payment failed");
  return { status: "success", transactionId: "txn_" + Date.now() };
};

export const checkInventory = async () => {
  await new Promise((res) => setTimeout(res, 800));
  if (Math.random() > 0.3) {
    return { status: "available" };
  } else {
    throw new Error("out of stock");
  }
};

export const scheduleShipping = async () => {
  await new Promise((res) => setTimeout(res, 1200));
  return { status: "scheduled", trackingId: "track_" + Date.now() };
};

export const sendNotification = async (message: string) => {
  await new Promise((res) => setTimeout(res, 500));
  console.log("notification send", message);
  return { status: "sent" };
};
