import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FCFBF7] text-[#2D2A26] antialiased selection:bg-[#FFE066]">
        {/* Simple layout wrapper; page file injects dynamic states */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}