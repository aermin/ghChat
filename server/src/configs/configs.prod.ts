import commonConfigs from './configs.common';
import secrets from '../../secrets';

export default {
  production: true,
  ...commonConfigs,
  ...secrets
};
