/* eslint-disable react-hooks/purity */
interface Props {
  user: any;
  stats: {
    total: number;
    completed: number;
  };
}

export default function ProfileCard({ user, stats }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 className="text-2xl font-bold">
        Profile
      </h2>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">Name:</span>{" "}
          {user?.name}
        </p>

        <p>
          <span className="font-semibold">Email:</span>{" "}
          {user?.email}
        </p>

        <p>
          <span className="font-semibold">Plan:</span>{" "}
          {user?.plan}
        </p>

        <p>
          <span className="font-semibold">Total Debates:</span>{" "}
          {stats.total}
        </p>

        <p>
          <span className="font-semibold">Completed:</span>{" "}
          {stats.completed}
        </p>

        <p>
          <span className="font-semibold">Member Since:</span>{" "}
          {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
        </p>
      </div>

    </div>
  );
}