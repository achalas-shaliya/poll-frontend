import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/api";
import { getOrCreateToken } from "@/utils/auth";
import io, { Socket } from "socket.io-client";
import { Poll } from "@/types/poll";

export default function PollPage() {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [tally, setTally] = useState([]);
  const [voted, setVoted] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchPoll();
    initSocket();
  }, [id]);

  const fetchPoll = async () => {
    const res = await api.get(`/poll/${id}`);
    setPoll(res.data);
    setTally(res.data.tally);
  };

  const initSocket = async () => {
    const sock = io(process.env.NEXT_PUBLIC_API_URL);
    sock.emit("join_poll", id);
    sock.on("vote", (data: any) => {
      console.log("DATA: ", data);
      setTally(data.delta), setTotal(data.total);
    });
    sock.on("poll_closed", (finalTally) => {
      alert("Poll closed!");
      setTally(finalTally);
    });
    setSocket(sock);
  };

  const vote = async (optionIndex: number) => {
    const token = await getOrCreateToken();
    console.log("Token:", token);
    try {
      await api.post(
        `/poll/vote`,
        { id, optionIndex },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVoted(true);
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };

  if (!poll) return <div>Loading...</div>;

  return (
    <div
      className="max-w-xl mx-auto mt-10 p-5 shadow rounded bg-white"
      style={{ padding: 20 }}
    >
      <h1 className="text-2xl font-semibold mb-4">{poll.question}</h1>
      <p>Expires at: {new Date(poll.expiresAt).toLocaleString()}</p>
      {poll?.options?.map((opt, i) => {
        const percentage = total ? ((tally[i] / total) * 100).toFixed(1) : "0";

        return (
          <div>
            <button
              className={`w-full px-4 py-2 text-left rounded border ${
                // voted || poll.closed
                // ? "bg-gray-200 cursor-not-allowed"
                "bg-blue-500 text-white"
              }`}
              // disabled={voted || poll.closed}
              onClick={() => vote(i)}
            >
              {opt}
            </button>
            <div className="w-full bg-gray-100 rounded h-4 mt-1">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {tally ? tally[i] : 0} votes ({percentage}%)
            </p>
          </div>
        );
      })}
    </div>
  );
}
