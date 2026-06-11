export default function Loading() {
  return (
    <div className="w-full flex flex-col justify-center items-center mx-auto min-h-screen gap-3">
      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600" />
      <span className="text-gray-500">Loading...</span>
    </div>
  );
}
