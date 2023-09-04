<template>

<button class="button-with-icon" :style="buttonCSS" @click="updateValue(!modelValue)">
    <Lucide :name="'CheckSquare'"  v-show="modelValue"/>
    <Lucide :name="'XSquare'"  v-show="!modelValue"/>
    <slot></slot>
</button>

</template>

<style scoped>
button {
    height: 2rem;
    font-size: var(--app-font-size);
}
</style>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>()
</script>

<script lang="ts">
import { defineComponent } from 'vue';

import Lucide from '../icons/Lucide.vue';

export default defineComponent({
    methods: {
        updateValue(v: boolean) {
            this.$emit("update:modelValue", v)
        }
    },
    computed: {
        buttonCSS() {
            return {
                border: this.modelValue ? "2px solid var(--app-accent-color)" : "2px solid var(--app-divider-color)"
            }
        }
    }
})
</script>