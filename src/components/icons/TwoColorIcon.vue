<template>
    <div class="outer">
        Abc
    </div>
</template>

<style scoped>
.outer {
    height: 2rem;
    width: 100%;
    background-color: v-bind(background);
    color: v-bind(foreground);
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    foreground: string,
    background: string
}>()
</script>