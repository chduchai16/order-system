export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
