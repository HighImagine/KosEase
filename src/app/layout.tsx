// Root layout passthrough: <html>/<body>/<lang> disediakan oleh
// src/app/[locale]/layout.tsx (wajib untuk routing locale next-intl).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
