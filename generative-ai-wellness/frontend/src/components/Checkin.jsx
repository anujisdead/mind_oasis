import { useState } from "react";

export default function Checkin({ userId, onSaved }) {
  const [mood, setMood] = useState(5);
  const [text, setText] = useState("");

  const save = async () => {
    const res = await fetch("http://localhost:4000/api/checkins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({ moodScale: mood, text })
    });
    const data = await res.json();
    onSaved(data.wellness);
    setText("");
  };

  return (
    <div className="card bg-white shadow-xl mt-6 p-6">
      <h2 className="text-xl font-bold text-indigo-700">Daily Check-in</h2>
      <label className="block mt-4 text-sm">Mood Scale: {mood}</label>
      <input type="range" min="0" max="10" value={mood}
        onChange={e => setMood(e.target.value)}
        className="range range-primary" />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="How are you feeling?"
        className="textarea textarea-bordered w-full mt-4"
      />
      <button onClick={save} className="btn btn-primary w-full mt-4">Save</button>
    </div>
  );
}
