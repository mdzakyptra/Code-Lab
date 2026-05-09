export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own full-screen layout — bypass root nav & main wrapper
  return <>{children}</>;
}
