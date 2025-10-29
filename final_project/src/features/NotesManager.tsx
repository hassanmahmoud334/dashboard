import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Note } from "../types";

export default function NotesManager() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes_v1", []);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Note["priority"]>("normal");

  const add = () => {
    if (!text.trim()) return;
    const n: Note = {
      id: uuidv4(),
      text: text.trim(),
      priority,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [n, ...prev]);
    setText("");
  };

  const del = (id: string) =>
    setNotes((prev) => prev.filter((x) => x.id !== id));
  const changePriority = (id: string, p: Note["priority"]) =>
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, priority: p } : n))
    );

  const grouped = {
    important: notes.filter((n) => n.priority === "important"),
    normal: notes.filter((n) => n.priority === "normal"),
    delayed: notes.filter((n) => n.priority === "delayed"),
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 items-center border border-gray-100">
        <input
          className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here..."
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="p-3 border border-gray-200  rounded-xl cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="important">Important</option>
          <option value="normal">Normal</option>
          <option value="delayed">Delayed</option>
        </select>
        <button
          onClick={add}
          className="px-5 py-3 bg-blue-600 text-white cursor-pointer rounded-xl hover:from-blue-600 hover:to-sky-800 transition-all duration-200 shadow-sm active:scale-90"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["important", "normal", "delayed"] as const).map((k) => (
          <div
            key={k}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden"
          >
            <div
              className={`p-4 text-white font-semibold capitalize sticky top-0 z-10 ${
                k === "important"
                  ? "bg-gradient-to-r from-rose-500 to-red-600"
                  : k === "normal"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600"
                  : "bg-gradient-to-r from-gray-500 to-gray-600"
              }`}
            >
              {k} ({grouped[k].length})
            </div>

            <ul className="p-4 space-y-3 bg-gradient-to-r from-white-300 to-gray-100 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {grouped[k].map((n) => (
                <li
                  key={n.id}
                  className="p-4 border bg-gray-100 rounded-xl bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 leading-snug">
                        {n.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        value={n.priority}
                        onChange={(e) =>
                          changePriority(n.id, e.target.value as any)
                        }
                        className="p-1 border border-gray-200 cursor-pointer rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="important">Important</option>
                        <option value="normal">Normal</option>
                        <option value="delayed">Delayed</option>
                      </select>

                      <button
                        onClick={() => del(n.id)}
                        className="text-rose-600 text-s hover:text-rose-700  cursor-pointer transition-all hover:scale-110"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}

              {grouped[k].length === 0 && (
                <p className="text-center text-sm text-gray-500 py-8">
                  No notes yet
                </p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
