import { setRequestLocale } from 'next-intl/server';
import { LandingLayout } from '@/components/LandingLayout';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <LandingLayout>
      {props.children}
    </LandingLayout>
  );
}
