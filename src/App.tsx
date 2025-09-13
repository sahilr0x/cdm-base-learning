import { orderMachine } from "./machines/orderMachines";
import { useActorRef, useSelector } from "@xstate/react";

function App() {
  const service = useActorRef(orderMachine);
  const state = useSelector(service, (state) => state);
  return (
    <>
      <div style={{ padding: "2ren", fontFamily: "sans-serif" }}>
        <h1>Order Workflow</h1>
        <h2>status : {JSON.stringify(state.value)}</h2>
        <p>order id: {state.context.orderId}</p>
        <p>
          payment confimed:{" "}
          {state.context.paymentConfirmed ? "confirmed" : "pending"}
        </p>
        <p>
          inventory available:{" "}
          {state.context.inventoryAvailable ? "available" : "no checked"}
        </p>
        {state.context.trackingId && (
          <p> tracking id : {state.context.trackingId}</p>
        )}

        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <button onClick={() => service.send({ type: "PAY" })}>Pay</button>
          <button onClick={() => service.send({ type: "CANCEL" })}>
            Cancel
          </button>
          <button
            onClick={() => service.send({ type: "DELIVER" })}
            disabled={!state.matches({ shipped: { delivery: "inTransit" } })}
          >
            Deliver
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
