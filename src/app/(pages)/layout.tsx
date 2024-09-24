import Sidebar from "../components/layouts/Sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex-grow bg-background-color p-6 overflow-auto">
        {children}
      </div>
    </>
  );
}
