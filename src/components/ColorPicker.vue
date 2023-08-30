

<template>
    <input type="color" :value="modelValue" @input.capture="handleInput(($event.target as HTMLInputElement).value)">
</template>

<style scoped>
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        modelValue: {type: String}
    },
    methods: {
        handleInput(value: string) {
            this.$emit("update:modelValue", value)
        }
    }
})
</script>