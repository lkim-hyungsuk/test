import '../wdyr';
import { getEnvFromUrl } from '../common/environment';
import { load } from './load';
import { setEnvFromStorage } from '../common/sessionStorage';

(async () => {
  const env = await getEnvFromUrl();
  setEnvFromStorage(env);
})();
load();
