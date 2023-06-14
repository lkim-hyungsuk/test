import { HTTP, INLINE_TRANSLATION_EDITOR, TranslationData } from '../common/constants';
import { getCsrfToken } from '../common/csrfToken';
import { getEnvFromUrl } from '../common/environment';
import { getEnvFromStorage } from '../common/sessionStorage';

export interface Dictionary {
  [key: string]: string;
}
export interface GetCurrentTabUrlMessage {
  url: any;
  type: 'getCurrentTabUrl';
}

export const fetchTranslationData = async (
  fingerprint: string,
  targetLocale: string
): Promise<TranslationData> => {
  const env = getEnvFromStorage() || (await getEnvFromUrl());
  const url = `${INLINE_TRANSLATION_EDITOR[env]}/(fingerprint:${fingerprint},targetLocale:${targetLocale})`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...HTTP.DEFAULT_HEADERS,
      'Csrf-Token': await getCsrfToken(),
    },
  });
  if (!res.ok) {
    throw new Error(`Error fetching data. Status code: ${res.status}`);
  }
  const data: TranslationData = await res.json();
  return data;
};
