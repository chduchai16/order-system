export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f3ed] font-sans text-gray-900">
      {children}
    </div>
  );
}
