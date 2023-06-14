interface Urls {
  [key: string]: string;
}
export const DEBOUNCE_TIMEOUT = 500;
export const WIDGET_TIMEOUT = 3000;
export const INLINE_TRANSLATION_EDITOR: Urls = {
  prod: 'https://www.linkedin.com/inline-translation-api/translationProposalEditor',
  ei: 'https://www.linkedin-ei.com/inline-translation-api/translationProposalEditor',
  test: 'https://pemberly.www.linkedin.com:4443/inline-translation-api/translationProposalEditor',
  local: 'https://localhost:9999/inline-translation-api/translationProposalEditor',
};

export const INLINE_TRANSLATION_PROPOSAL: Urls = {
  prod: 'https://www.linkedin.com/inline-translation-api/translationProposal',
  ei: 'https://www.linkedin-ei.com/inline-translation-api/translationProposal',
  test: 'https://pemberly.www.linkedin.com:4443/inline-translation-api/translationProposal',
  local: 'https://localhost:9999/inline-translation-api/translationProposal',
};

export const INLINE_TRANSLATION_VALIDATION: Urls = {
  prod: 'https://www.linkedin.com/inline-translation-api/translationProposal?action=validate',
  ei: 'https://www.linkedin-ei.com/inline-translation-api/translationProposal?action=validate',
  test: 'https://pemberly.www.linkedin.com:4443/inline-translation-api/translationProposal?action=validate',
  local: 'https://localhost:9999/inline-translation-api/translationProposal?action=validate',
};

export const HTTP = Object.freeze({
  LINKEDIN_URL_PROD: 'https://www.linkedin.com',
  LINKEDIN_URL_EI: 'https://www.linkedin-ei.com',
  LINKEDIN_URL_EI_TEST: 'https://pemberly.www.linkedin.com:4443',
  DEFAULT_HEADERS: {
    'X-RestLi-Protocol-Version': '2.0.0',
    'Content-Type': 'application/html',
  },
});

export const XMESSAGE_ERROR_DOC = 'https://www.linkedintools.com/xmessage/validation/issue';

export enum MessageType {
  apiFetch,
  setCookie,
  removeCookie,
  insertCSS,
  removeCSS,
  getCurrentTabUrl,
}

export type extensionMessage = {
  messageType: MessageType;
  payload: any;
};

export type Proposal = {
  author: string;
  fingerprint: string;
  status: string;
  targetLocale: any;
  targetTranslation: string;
};

export interface TranslationData {
  fingerprint: string;
  proposals: Proposal[];
  sourceDeleted: boolean;
  sourceLocale: {
    country: string;
    language: string;
  };
  sourceTranslation: string;
  userProfileType: string;
}

export enum LocalStorageKey {
  iltEnabled = 'ilt-extension-enabled',
}

export enum InternalMessageType {
  getLocalStorage,
  setLocalStorage,
  enable,
  disable,
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const ILT_ENABLED_CLASS = 'ilt-enabled';
export const ILT_COOKIE_NAME = 'ilt_enabled';

interface LanguageLinks {
  [key: string]: string;
}
export const groupLinks: LanguageLinks = {
  ar_AE: 'https://www.linkedin.com/groups/9218276/', // Arabic
  cs_CZ: 'https://www.linkedin.com/groups/9221255/', // Czech
  da_DK: 'https://www.linkedin.com/groups/9219335/', // Danish
  de_DE: 'https://www.linkedin.com/groups/9218277/', // German
  es_ES: 'https://www.linkedin.com/groups/9219422/', // Spanish
  fr_FR: 'https://www.linkedin.com/groups/9219361/', // French
  hi_IN: 'https://www.linkedin.com/groups/9221279/', // Hindi
  in_ID: 'https://www.linkedin.com/groups/9220323/', // Indonesian
  it_IT: 'https://www.linkedin.com/groups/9219390/', // Italian
  ja_JP: 'https://www.linkedin.com/groups/9225328/', // Japanese
  ko_KR: 'https://www.linkedin.com/groups/9222355/', // Korean
  ms_MY: 'https://www.linkedin.com/groups/9223354/', // Malay
  nl_N: 'https://www.linkedin.com/groups/9224283/', // Dutch
  no_NO: 'https://www.linkedin.com/groups/9218348/', // Norwegian
  pl_PL: 'https://www.linkedin.com/groups/9224328/', // Polish
  pt_BR: 'https://www.linkedin.com/groups/9225356/', // Portuguese
  ro_RO: 'https://www.linkedin.com/groups/9220345/', // Romanian
  ru_RU: 'https://www.linkedin.com/groups/9224366/', // Russian
  sv_SE: 'https://www.linkedin.com/groups/9223416/', // Swedish
  th_TH: 'https://www.linkedin.com/groups/9219473/', // Thai
  tl_PH: 'https://www.linkedin.com/groups/9221391/', // Tagalog
  tr_TR: 'https://www.linkedin.com/groups/9219474/', // Turkish
  uk_UA: 'https://www.linkedin.com/groups/9221417/', // Ukrainian
  zh_CN: 'https://www.linkedin.com/groups/9218294/', // Chinese (Simplified)
  zh_TW: 'https://www.linkedin.com/groups/9222318/', // Chinese (Traditional)
};
