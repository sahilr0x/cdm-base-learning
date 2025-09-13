import { orderMachine } from "./machines/orderMachines";
import { useActorRef, useSelector } from "@xstate/react";

function App() {
  const service = useActorRef(orderMachine);
  const state = useSelector(service, (state) => state);
  return (
    <>
      <div style={{ padding: "2ren", fontFamily: "sans-serif" }}>
        <h1>Order Workflow</h1>
      </div>
    </>
  );
}

export default App;
