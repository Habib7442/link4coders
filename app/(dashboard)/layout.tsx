
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      
      {/* Main Content */}
      <main className="mx-auto">
        {children}
      </main>
    </div>
  );
}