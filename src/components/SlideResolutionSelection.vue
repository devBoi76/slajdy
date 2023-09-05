<template>
    <div class="container">
        <div>
            <MultiSelection :value="'1080p'" v-model="value">
                <div class="selection-wrapper" :style="value == '1080p' ? 'width: 7rem' : ''">
                    1080p<br>
                    (FullHD)
                </div>
            </MultiSelection>
            <MultiSelection :value="'1440p'" v-model="value">
                <div class="selection-wrapper" :style="value == '1440p' ? 'width: 7rem' : ''">
                    1440p<br>
                    (QHD)
                </div>
            </MultiSelection>
            <MultiSelection :value="'2160p'" v-model="value">
                <div class="selection-wrapper" :style="value == '2160p' ? 'width: 7rem' : ''">
                    2160p<br>
                    (4K UHD)
                </div>
            </MultiSelection>
        </div>
        <h1>Rozdzielczość</h1>
    </div>
</template>

<style scoped>
    .selection-wrapper {
        padding: 0.25rem;
        width: 5rem;
        transition: width 150ms;
        font-weight: bold;
        background-color: var(--app-foreground-color);
    }
    .selection-wrapper:hover {
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
import { computed,  } from 'vue';
import MultiSelection from '@/components/input/MultiSelection.vue';
import TwoColorIcon from '@/components/icons/TwoColorIcon.vue';
import {type Resolutions} from '@/stores/editor'


const props = defineProps<{
    modelValue: Resolutions
}>()

const emit = defineEmits<{
    (type: "update:modelValue", v: typeof props.modelValue): void
}>()

const value = computed<typeof props.modelValue>({
    get() {
        return props.modelValue
    },
    set(value) {
        localStorage.setItem("app-slide-resolution", value)
        emit("update:modelValue", value)
    }
})

</script>