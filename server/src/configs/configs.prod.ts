/* eslint-disable global-require */
import commonConfigs from './configs.common';

export default {
  production: true,
  ...commonConfigs,
  ...require('../../secrets'),
};
