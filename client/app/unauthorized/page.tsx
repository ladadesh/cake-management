export default function UnauthorizedPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-500">
        Unauthorized Access 🚫
      </h1>
      <p className="mt-4 text-gray-600">
        You don’t have permission to view this page.
      </p>
    </div>
  );
}
