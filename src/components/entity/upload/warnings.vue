<!--
Copyright 2024 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <div id="entity-upload-warnings">
    <entity-upload-warning v-if="raggedRows != null" :ranges="raggedRows"
      @rows="$emit('rows', $event)">
      {{ $t('row.raggedRows') }}
    </entity-upload-warning>
    <entity-upload-warning v-if="largeCell != null" :ranges="[[largeCell, largeCell]]"
      @rows="$emit('rows', $event)">
      {{ $t('row.largeCell') }}
    </entity-upload-warning>
  </div>
</template>

<script setup>
import EntityUploadWarning from './warning.vue';

defineOptions({
  name: 'EntityUploadWarnings'
});
defineProps({
  raggedRows: Array,
  largeCell: Number
});
defineEmits(['rows']);
</script>

<style lang="scss">
#entity-upload-warnings {
  background-color: #deedf3;
  padding: 9px 6px;
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a warning that is followed by a list of rows.
    "row": {
      "raggedRows": "Fewer columns were found than expected in some rows:",
      "largeCell": "Some cells are abnormally large, which can indicate difficulties reading your file:"
    }
  }
}
</i18n>

<!-- Autogenerated by destructure.js -->
<i18n>
{
  "de": {
    "row": {
      "raggedRows": "In einigen Zeilen wurden weniger Spalten als erwartet gefunden:",
      "largeCell": "Einige Zellen sind ungewöhnlich groß, was auf Schwierigkeiten beim Lesen Ihrer Datei hinweisen kann:"
    }
  },
  "es": {
    "row": {
      "raggedRows": "Se encontraron menos columnas de las esperadas en algunas filas:",
      "largeCell": "Algunas celdas son anormalmente grandes, lo que puede indicar dificultades para leer su archivo:"
    }
  },
  "fr": {
    "row": {
      "raggedRows": "Dans certaines lignes, il y a eu moins de colonnes détectées que prévu:",
      "largeCell": "Certaines cellules sont anormalement larges, ce qui peut indiquer des difficultés à lire votre fichier:"
    }
  },
  "it": {
    "row": {
      "raggedRows": "In alcune righe sono state trovate meno colonne del previsto:",
      "largeCell": "Alcune celle sono eccessivamente grandi, il che può indicare difficoltà nella lettura del file:"
    }
  },
  "pt": {
    "row": {
      "raggedRows": "Menos colunas foram encontradas do que o esperado em algumas linhas:",
      "largeCell": "Algumas células são anormalmente grandes, o que pode indicar dificuldades na leitura do seu arquivo:"
    }
  },
  "zh-Hant": {
    "row": {
      "raggedRows": "在某些行中發現的列數少於預期：",
      "largeCell": "有些儲存格異常大，這可能表示讀取檔案有困難："
    }
  }
}
</i18n>
