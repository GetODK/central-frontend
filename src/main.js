/*
Copyright 2017 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import { createApp } from 'vue';

// The global styles must be imported before any component so that they precede
// components' styles.
import './styles';

import createContainer from './container';
import vTooltip from './directives/tooltip';
// ./jquery must be imported before any of Bootstrap's JavaScript plugins,
// because the plugins require jQuery.
import './jquery';
import './bootstrap';

// App must be imported after the Bootstrap modal plugin.
import App from './components/app.vue';

createApp(App)
  .use(createContainer())
  .directive('tooltip', vTooltip)
  .mount('#app');
