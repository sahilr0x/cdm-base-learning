export interface OrderContestType {
  orderId: string;
  paymentConfirmed: boolean;
  inventoryAvailable: boolean;
  trackingId?: string;
}

export type OrderEvent =
  | { type: "PAY" }
  | { type: "CANCEL" }
  | { type: "DELIVER" };
