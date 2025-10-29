import axios from "axios";
import type { Post, Todo, User } from "../types";

const BASE = "https://jsonplaceholder.typicode.com";

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get(`${BASE}/users`);
  return data;
};

export const fetchUser = async (id: string): Promise<User> => {
  const { data } = await axios.get(`${BASE}/users/${id}`);
  return data;
};

export const fetchPostsByUser = async (userId: string): Promise<Post[]> => {
  const { data } = await axios.get(`${BASE}/posts`, { params: { userId } });
  return data;
};

export const fetchTodosByUser = async (userId: string): Promise<Todo[]> => {
  const { data } = await axios.get(`${BASE}/todos`, { params: { userId } });
  return data;
};
