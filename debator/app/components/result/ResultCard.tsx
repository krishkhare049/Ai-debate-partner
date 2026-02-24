interface Props {
  result: any;
}

export default function ResultCard({ result }: Props) {
  if (!result) return null;

  const { winner, scores, analysis } = result;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 className="text-2xl font-bold">
        Winner: {winner.toUpperCase()}
      </h2>

      <div className="space-y-2">
        <p>Logic: {scores?.logic}</p>
        <p>Persuasion: {scores?.persuasion}</p>
        <p>Clarity: {scores?.clarity}</p>
      </div>

      <div>
        <h3 className="font-semibold">Analysis</h3>
        <p className="text-gray-600">{analysis}</p>
      </div>

    </div>
  );
}