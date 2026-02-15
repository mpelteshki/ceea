import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <div className="mx-auto w-full max-w-6xl px-5 py-10">{children}</div>;
}

