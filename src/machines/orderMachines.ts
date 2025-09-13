import { assign, createMachine } from "xstate";
import type { OrderContestType } from "../utils/types";

export const orderMachine = createMachine({
  id: "order",
  initial: "pending",
  context: {
    orderId: "ORD-123",
    paymentConfirmed: false,
    inventaryAvailable: false,
    trackingId: undefined,
  } as OrderContestType,
  states: {
    pending: {
      on: {
        PAY: "processingPayment",
        CANCEL: "cancelled",
      },
    },

    processingPayment: {
      invoke: {
        src: "verifyPayment",
        onDone: {
          target: "checkingInventory",
          actions: assign({ paymentConfirmed: true }),
        },
        onError: "failed",
      },
    },

    checkingInventory: {
      invoke: {
        src: "checkInventory",
        onDone: {
          target: "shipping",
          actions: assign({ inventaryAvailable: true }),
        },
        onError: "failed",
      },
    },

    shipping: {
      invoke: {
        src: "scheduleShipping",
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
                src: "sendNotification",
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
