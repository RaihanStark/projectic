import { LandingLayout } from '@/components/LandingLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingLayout>
      {children}
    </LandingLayout>
  );
}
