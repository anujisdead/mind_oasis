import { useState } from "react";
import Checkin from "./components/Checkin";

export default function App() {
  const userId = "68cc352ce3987c7236ec9e2c"; // replace with real
  const [wellness, setWellness] = useState(null);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center text-indigo-800">🌿 Mind Oasis</h1>
      <Checkin userId={userId} onSaved={setWellness} />
      {wellness && (
        <div className="alert alert-info mt-6">
          Wellness Score: {wellness.score} ({wellness.category})
        </div>
      )}
    </div>
  );
}
