// import "../globals.css";
export const metadata = {
  title: "weasker | Studio",
  description: "Mutual Consumer Knowledge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
