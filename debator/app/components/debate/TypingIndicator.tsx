export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 px-4 py-2 rounded-lg flex gap-1">
        <span className="animate-bounce">•</span>
        <span className="animate-bounce delay-150">•</span>
        <span className="animate-bounce delay-300">•</span>
      </div>
    </div>
  );
}