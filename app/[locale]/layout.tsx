import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'ko';
  
  console.log('Layout locale:', locale);
  
  let messages = {};
  try {
    messages = await getMessages();
  } catch (error) {
    console.log('Layout: Using fallback messages for locale:', locale);
    // 기본 메시지 직접 로드
    try {
      const fallbackMessages = await import(`../../locales/ko.json`);
      messages = fallbackMessages.default;
    } catch (fallbackError) {
      console.log('Fallback message loading failed:', fallbackError);
    }
  }

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}