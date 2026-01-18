export function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
