// Generate static paths for providers
export function generateStaticParams() {
  return [
    { providerId: '1' },
    { providerId: '2' },
    { providerId: '3' },
    { providerId: '4' },
  ];
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
