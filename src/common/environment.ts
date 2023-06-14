import browser from 'webextension-polyfill';
import { GetCurrentTabUrlMessage } from '../ilt/api';

const ENVIRONMENT = {
  EI: 'ei',
  TEST: 'test',
  LOCAL: 'local',
  PROD: 'prod',
};

export const getEnvFromUrl = async () => {
  const response = (await browser.runtime.sendMessage({
    type: 'getCurrentTabUrl',
  })) as GetCurrentTabUrlMessage;

  if (response.url.startsWith('https://www.linkedin-ei.com')) {
    return ENVIRONMENT.EI;
  } else if (response.url.startsWith('https://pemberly.www.linkedin.com:4443')) {
    return ENVIRONMENT.TEST;
  } else if (response.url.startsWith('https://localhost:9999')) {
    return ENVIRONMENT.LOCAL;
  } else {
    return ENVIRONMENT.PROD;
  }
};
