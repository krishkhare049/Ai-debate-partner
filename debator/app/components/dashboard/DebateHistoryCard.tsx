import { useRouter } from "next/navigation";

interface Props {
  debate: any;
}

export default function DebateHistoryCard({ debate }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/debate/${debate._id}`)}
      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
    >
      <h3 className="font-semibold">
        {debate.topic}
      </h3>

      <p className="text-sm text-gray-500">
        {new Date(debate.createdAt).toLocaleString()}
      </p>

      <p className="text-sm">
        Status: {debate.status}
      </p>
    </div>
  );
}