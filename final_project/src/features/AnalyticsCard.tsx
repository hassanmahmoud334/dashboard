import { useQuery } from "@tanstack/react-query";
import { fetchUsers} from "../api/users";

export default function AnalyticsCard() {
  const { data: users } = useQuery({queryKey: ["users"], queryFn: fetchUsers});

  const { data: allPosts, isLoading: postsLoading } = useQuery({queryKey: ["posts_all"], queryFn: async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    return res.json();
  }});

  const { data: allTodos, isLoading: todosLoading } = useQuery({queryKey: ["todos_all"], queryFn: async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    return res.json();
  }});

  if (!users || postsLoading || todosLoading) return <div>Loading analytics...</div>;

  const postsByUser = (allPosts as any[]).reduce<Record<number, number>>((acc, p) => {
    acc[p.userId] = (acc[p.userId] || 0) + 1;
    return acc;
  }, {});

  const completedByUser = (allTodos as any[]).reduce<Record<number, number>>((acc, t) => {
    if (t.completed) acc[t.userId] = (acc[t.userId] || 0) + 1;
    return acc;
  }, {});

  const userStats = users.map(u => ({
    id: u.id,
    username: u.username,
    posts: postsByUser[u.id] || 0,
    completedTodos: completedByUser[u.id] || 0,
  }));

  const mostPosts = userStats.reduce((a, b) => (b.posts > a.posts ? b : a), userStats[0]);
  const fewestPosts = userStats.reduce((a, b) => (b.posts < a.posts ? b : a), userStats[0]);
  const mostCompletedTodos = userStats.reduce((a,b)=> (b.completedTodos > a.completedTodos ? b : a), userStats[0]);
  const fewestCompletedTodos = userStats.reduce((a,b)=> (b.completedTodos < a.completedTodos ? b : a), userStats[0]);

  return (
    <div className="space-y-4">
      <div className="p-3 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl">
        <div className="text-sm text-white-800 ">Total users</div>
        <div className="text-2xl font-bold text-black-800">{users?.length || 0}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Most posts</div>
          <div className="font-semibold text-gray-800">{mostPosts?.username}</div>
          <div className="text-sm text-blue-600">{mostPosts?.posts} posts</div>
        </div>

        <div className="p-3 bg-gray-200 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Fewest posts</div>
          <div className="font-semibold text-gray-800">{fewestPosts?.username}</div>
          <div className="text-sm text-blue-600">{fewestPosts?.posts} posts</div>
        </div>

        <div className="p-3 bg-gray-200 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Most completed</div>
          <div className="font-semibold text-gray-800">{mostCompletedTodos?.username}</div>
          <div className="text-sm text-green-600">{mostCompletedTodos?.completedTodos} todos</div>
        </div>

        <div className="p-3 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Fewest completed</div>
          <div className="font-semibold text-gray-800">{fewestCompletedTodos?.username}</div>
          <div className="text-sm text-green-600">{fewestCompletedTodos?.completedTodos} todos</div>
        </div>
      </div>
    </div>
  );
}