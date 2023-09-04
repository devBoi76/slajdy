<template>
    <div class="container">
        <div>
            <MultiSelection :value="'light'" v-model="value">
                <div class="icon-wrapper" :style="value == 'light' ? 'width: 7rem' : ''">
                    <TwoColorIcon :foreground="'#3d3d3f'" :background="'#fff'"/>
                </div>
            </MultiSelection>
            <MultiSelection :value="'reading'" v-model="value">
                <div class="icon-wrapper" :style="value == 'reading' ? 'width: 7rem' : ''">
                    <TwoColorIcon :foreground="'#14120d'" :background="'#f9f3ea'"/>
                </div>
            </MultiSelection>
            <MultiSelection :value="'dark'" v-model="value">
                <div class="icon-wrapper" :style="value == 'dark' ? 'width: 7rem' : ''">
                    <TwoColorIcon :foreground="'#edebe5'" :background="'#000'"/>
                </div>
            </MultiSelection>
        </div>
        <h1>Motyw</h1>
    </div>
</template>

<style scoped>
    .icon-wrapper {
        width:5rem;
        transition: width 150ms;
    }
    .icon-wrapper:hover {
        width: 6rem;
    }
    .container {
        display: flex;
        /* align-items: center; */
        justify-content: space-between;
    }
    h1 {
        font-size: 1.5rem;
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import MultiSelection from '@/components/input/MultiSelection.vue';
import TwoColorIcon from '@/components/icons/TwoColorIcon.vue';
import {type ColorThemes} from '@/stores/editor'

const props = defineProps<{
    modelValue: ColorThemes
}>()

const emit = defineEmits<{
    (type: "update:modelValue", v: typeof props.modelValue): void
}>()

const value = computed<typeof props.modelValue>({
    get() {
        return props.modelValue
    },
    set(value) {
        localStorage.setItem("app-theme", value)
        emit("update:modelValue", value)
    }
})

</script>