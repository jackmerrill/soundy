import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { io, Socket } from "socket.io-client";
import Modal from "../components/Modal";

export default function Index() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sounds, setSounds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => socketInitializer(), []);

  useEffect(() => {
    socket?.emit("listSounds", (sounds: string[]) => setSounds(sounds));
  }, [modalOpen, socket]);

  const socketInitializer = (): void => {
    const s = io("https://39ca-65-57-82-58.ngrok.io");

    setSocket(s);

    s.on("connect", () => {
      s.emit("listSounds", (data: any) => {
        setSounds(data);
      });
    });

    s.on("update", (data: any) => {
      setSounds(data);
    });
  };

  return (
    <div className="flex justify-center h-full px-12 py-16 bg-gray-800">
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-bold text-white">Soundboard</h1>
          <button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            New Sound
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {sounds.length > 0 ? (
            sounds.map((sound: string) => (
              <div
                key={sound}
                className="flex flex-wrap items-center justify-center pb-2 space-x-2 space-y-2 bg-gray-700 rounded-md"
              >
                <ReactPlayer url={sound} />

                <button
                  className="px-4 py-2 font-bold text-white bg-gray-800 rounded-md"
                  onClick={() => socket?.emit("playSound", sound)}
                >
                  Play
                </button>

                <button
                  className="px-4 py-2 font-bold text-white bg-gray-800 rounded-md"
                  onClick={() =>
                    socket?.emit("deleteSound", sound, (sounds: string[]) => {
                      console.log(sounds);
                      setSounds(sounds);
                    })
                  }
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-200">Waiting for sounds...</p>
          )}
        </div>
      </div>
      {socket && (
        <Modal open={modalOpen} setOpen={setModalOpen} socket={socket} />
      )}
    </div>
  );
}
