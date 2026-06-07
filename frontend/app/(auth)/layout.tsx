export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFAF7] font-sans text-[#222222]">
      {children}
    </div>
  );
}
