import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUser, fetchPostsByUser, fetchTodosByUser } from "../api/users";
import type { Todo } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import defaultAvatar from "../assets/profilepic.webp";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "todos">("posts");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostsByUser(id!),
  });

  const { data: todos, isLoading: todosLoading } = useQuery({
    queryKey: ["todos", id],
    queryFn: () => fetchTodosByUser(id!),
  });

  const [overrides, setOverrides] = useLocalStorage<Record<number, boolean>>(
    `todos_override_${id}`,
    {}
  );

  const toggle = (todo: Todo) => {
    setOverrides((prev) => ({ ...prev, [todo.id]: !getCompleted(todo) }));
  };

  const getCompleted = (t: Todo) => {
    if (overrides && overrides[t.id] !== undefined) return overrides[t.id];
    return t.completed;
  };

  const completedCount = todos?.filter((t) => getCompleted(t)).length || 0;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex flex-col items-center">

      <div className="w-full max-w-3xl mb-4">
        <Link
          to="/users"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Users
        </Link>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
        <img
          src={defaultAvatar}
          alt="User avatar"
          className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-gray-600">@{user?.username}</p>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

          <div className="flex justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-blue-500 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12"
                />
              </svg>
              {posts?.length || 0} Posts
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {completedCount}/{todos?.length || 0} Todos
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-6">
        <div className="flex gap-3 bg-white rounded-2xl shadow-sm p-2 border border-gray-100">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 cursor-pointer rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "posts"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("todos")}
            className={`flex-1 py-3 cursor-pointer rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "todos"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-6">
        {activeTab === "posts" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Posts
            </h2>

            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[28rem] overflow-y-auto">
                {posts?.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              To-do List
            </h2>

            {todosLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[28rem] overflow-y-auto">
                {todos?.map((todo) => {
                  const done = getCompleted(todo);
                  return (
                    <div
                      key={todo.id}
                      className={`p-4 border rounded-xl transition-all duration-200 ${
                        done
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-100 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggle(todo)}
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                              done
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 hover:border-green-500"
                            }`}
                          >
                            {done && (
                              <svg
                                className="w-3 h-3 text-white mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <span
                            className={`text-sm flex-1 ${
                              done
                                ? "text-green-700 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {todo.title}
                          </span>
                        </div>
                        <button
                          onClick={() => toggle(todo)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            done
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {done ? "Undo" : "Done"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
