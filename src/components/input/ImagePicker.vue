

<template>
    <div class="wrapper">
        <div>
            <img :src="modelValue">
        </div>
        <input type="file" accept="image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/webp" multiple="false" v-on:change=" (ev) => {handleInput(fileToSRC((ev.target as HTMLInputElement).files![0]))}">
    </div>
</template>

<style scoped>
img {
    margin: auto;
    position: absolute;
    inset: 0;
    max-height: 100%;
}

.wrapper {
    
    width: 10rem;
    height: 10rem;

    border: 2px solid var(--app-divider-color);
    overflow:hidden;
    display: flex;
    flex-direction: column;
}

.wrapper > div {
    position: relative;
    flex-grow: 1;
}

</style>

<script setup lang="ts">
const vpickerimg = ref<InstanceType<typeof HTMLImageElement> | null>(null)
</script>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    emits: ["update:modelValue", "imageInput"],
    props: {
        modelValue: {type: String}
    },
    methods: {
        fileToSRC(file: File) {return URL.createObjectURL(file)},
        pickerImg() {return this.$refs.vpickerimg as InstanceType<typeof HTMLImageElement>},
        handleInput(value: string) {
            this.$emit("imageInput", value)
            this.$emit("update:modelValue", value)
        }
    }
})
</script>