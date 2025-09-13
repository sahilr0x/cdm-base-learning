export interface OrderContestType {
  orderId: string;
  paymentConfirmed: boolean;
  inventaryAvailable: boolean;
  trackingId?: string;
}
