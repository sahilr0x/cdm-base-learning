import { assign, createMachine, fromPromise } from "xstate";
import type { OrderContestType, OrderEvent } from "../utils/types";
import {
  checkInventory,
  scheduleShipping,
  sendNotification,
  verifyPayment,
} from "../services/orderService";

export const orderMachine = createMachine({
  id: "order",
  initial: "pending",
  context: {
    orderId: "ORD-123",
    paymentConfirmed: false,
    inventoryAvailable: false,
    trackingId: undefined,
  } as OrderContestType,
  types: {
    context: {} as OrderContestType,
    events: {} as OrderEvent,
  },

  states: {
    pending: {
      on: {
        PAY: "processingPayment",
        CANCEL: "cancelled",
      },
    },

    processingPayment: {
      invoke: {
        src: fromPromise(() => verifyPayment()),
        onDone: {
          target: "checkingInventory",
          actions: assign({ paymentConfirmed: (_) => true }),
        },
        onError: "failed",
      },
    },

    checkingInventory: {
      invoke: {
        src: fromPromise(() => checkInventory()),
        onDone: {
          target: "shipping",
          actions: assign({ inventoryAvailable: (_) => true }),
        },
        onError: "failed",
      },
    },

    shipping: {
      invoke: {
        src: fromPromise(() => scheduleShipping()),
        onDone: {
          target: "shipped",
          actions: assign({
            trackingId: (_, event) => (event as any).data.trackingId,
          }),
        },
        onError: "failed",
      },
    },

    shipped: {
      type: "parallel",
      states: {
        delivery: {
          initial: "inTransit",
          states: {
            inTransit: {
              on: { DELIVER: "delivered" },
            },
            delivered: { type: "final" },
          },
        },
        notification: {
          initial: "sending",
          states: {
            sending: {
              invoke: {
                src: fromPromise(() => sendNotification("Order Shipped")),
                onDone: "done",
                onError: "done",
              },
            },
            done: { type: "final" },
          },
        },
      },
      onDone: "delivered",
    },

    delivered: { type: "final" },
    cancelled: { type: "final" },
    failed: { type: "final" },
  },
});
