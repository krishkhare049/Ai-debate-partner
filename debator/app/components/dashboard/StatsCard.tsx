interface Props {
  title: string;
  value: string | number;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold">
        {value}
      </h2>
    </div>
  );
}