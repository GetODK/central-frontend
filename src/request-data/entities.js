/*
Copyright 2023 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import { shallowReactive } from 'vue';

import { useRequestData } from './index';

export default () => {
  const { createResource } = useRequestData();
  const entityOData = createResource('odataEntities', () => ({
    transformResponse: ({ data }) => shallowReactive({
      value: shallowReactive(data.value),
      originalCount: data['@odata.count'],
      count: data['@odata.count'],
      nextLink: data['@odata.nextLink']
    }),
    removeData() {
      entityOData.value.splice(0, entityOData.value.length);
    },
    addChunk(chunk) {
      for (const e of chunk.value) {
        entityOData.value.push(e);
      }
      entityOData.count = chunk['@odata.count'];
      entityOData.nextLink = chunk['@odata.nextLink'];
    }
  }));
  return entityOData;
};
