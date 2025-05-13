import { useState } from "react";
import api from "../utils/api";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (i: any, value: any) => {
    const newOpts = [...options];
    newOpts[i] = value;
    setOptions(newOpts);
  };

  const createPoll = async () => {
    const res = await api.post("/poll", { question, options, expiresAt });
    alert(`Poll created: ${res.data.id}`);
    window.location.href = `/poll/${res.data.id}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Poll</h1>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <br />
      {options.map((opt, i) => (
        <div key={i}>
          <input
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={addOption}>Add Option</button>
      <br />
      <br />
      <input
        type="datetime-local"
        onChange={(e) => setExpiresAt(e.target.value)}
      />
      <br />
      <br />
      <button onClick={createPoll}>Create Poll</button>
    </div>
  );
}
