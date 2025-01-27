'use client';
import React, { useMemo } from 'react';
interface FormatDateProps {
  date: Date;
}
export function FormatDate({ date }: FormatDateProps) {
  // const [locale, setLocale] = React.useState('en-US');
  // React.useEffect(() => {
  //   const usersLocale = navigator.language;
  //   if (usersLocale) {
  //     setLocale(usersLocale);
  //   }
  // }, []);
  // const intl = useMemo(
  //   () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
  //   [locale],
  // );
  const intl = useMemo(() => {
    const usersLocale = navigator.language;
    return new Intl.DateTimeFormat(usersLocale, { dateStyle: 'medium' });
  }, []);

  return <>{intl.format(date)}</>;
}
