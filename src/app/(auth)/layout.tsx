export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center items-center w-full h-full">
      <div className="absolute top-5 left-10">
        <strong className="text-3xl transition-all duration-400 ease-in-out overflow-x-hidden opacity-100 w-auto">
          DailyLog<span className="text-first-color">.</span>
        </strong>
      </div>
      {children}
    </div>
  );
}
