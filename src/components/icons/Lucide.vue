<template>
  <component :is="icon" />
</template>

<script setup lang="ts">
import * as icons from "lucide-vue-next"
import { computed } from "vue";

type IconNames = keyof typeof icons;

const props = defineProps<{
  name: IconNames
}>()

const icon = computed<typeof icons[IconNames]>(() => icons[props.name])

</script>

