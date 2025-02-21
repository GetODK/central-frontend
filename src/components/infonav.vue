<!--
Copyright 2025 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <div class="infonav-button dropdown">
    <router-link v-if="link != null" :to="link">
      <span :class="icon"></span>
      {{ title }}
    </router-link>
    <button v-else :id="toggleId" type="button" class="btn-link dropdown-toggle" data-toggle="dropdown"
      aria-haspopup="menu" aria-expanded="false">
      <span :class="icon"></span>
      {{ title }}
      <span class="icon-angle-down"></span>
    </button>
    <ul class="dropdown-menu" :aria-labelledby="toggleId">
      <template v-for="item in items" :key="item.id">
        <li v-if="item.type === 'dataset'">
          <dataset-link :name="item.name" :project-id="item.projectId"/>
        </li>
        <li v-if="item.type === 'form'">
          <form-link
          :form="item.form"
          :to="publishedFormPath(item.form.projectId, item.form.xmlFormId)" v-tooltip.text/>
        </li>
        <!--todo: handle entity type-->
      </template>
    </ul>
  </div>
</template>


<script>
let id = 1;
</script>
<script setup>
import FormLink from './form/link.vue';
import DatasetLink from './dataset/link.vue';
import useRoutes from '../composables/routes';

const { publishedFormPath } = useRoutes();

defineProps({
  icon: {
    type: String,
    default: 'icon-magic-wand'
  },
  title: {
    type: String,
    required: true
  },

  // If a link is provided, the button will navigate to that link when clicked instead of dropping down.
  link: String,

  // Items can be several types, each with custom rendering: Form, Dataset, Entity, plain link, or divider.
  // Each item knows its type and contains its own data, e.g. { type: 'form', data: form }
  items: {
    type: Array,
    default: () => []
  }
});

const idPrefix = `infonav${id}`;
id += 1;
const toggleId = `${idPrefix}-toggle`;

</script>

<style lang="scss">
  .infonav-button {
    margin-left: 10px;
    font-size: 15px;
    white-space: nowrap;
  }
</style>
