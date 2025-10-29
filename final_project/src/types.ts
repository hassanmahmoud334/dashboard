export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  [key: string]: any;
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type Note = {
  id: string;
  text: string;
  priority: "important" | "normal" | "delayed";
  createdAt: string;
};
