<template>

<button class="button-with-icon" :style="buttonCSS" @click="updateValue(!modelValue)">
    <IconCheck v-show="modelValue"></IconCheck>
    <IconX v-show="!modelValue"></IconX>
    <slot></slot>
</button>

</template>

<style scoped>
button {
    height: 2rem;
    font-size: 1rem;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>()
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import IconCheck from '../icons/IconCheck.vue';
import IconX from '../icons/IconX.vue';

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