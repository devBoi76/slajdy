<template>
  <Transition>
    <div v-if="isOpen" class="background" @click.self="close()">
      <div class="wrapper">
            <header>
                <h1>{{ title }}</h1>
                <Lucide :name="'X'" @click="close()"/>
            </header>
            <main>
              <slot>

              </slot>
            </main>
        </div>
    </div>
  </Transition>
</template>

<style scoped>

.feather-x:hover {
  color: red;
  cursor: pointer;
  transition: color 150ms;
}
.feather-x {
  box-sizing: content-box;
  border-radius: 100%;
  padding: 0.5rem;
  /* border: 2px solid var(--app-divider-color); */
}

h1 {
  margin-left: 1rem;
}

main {
  max-height: 60vh;
  overflow-y: scroll;
  border-bottom: 2px solid var(--app-divider-color);
  height: 100%;
  padding-bottom: 1rem;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--app-divider-color);
  box-shadow: 0 -12px 12px 4px var(--app-text-color);
  padding: 0.5rem 1rem;
  position: relative;
  z-index: 1;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.wrapper {
  border-radius: var(--app-border-radius);
  width: 80%;
  background-color: var(--app-foreground-color);
  margin: 2rem auto auto auto;
  z-index: 1001;
  overflow: hidden;
}
.background {
  display: flex;
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
/* .wrapper {
    position: absolute;
    inset: 0;
    background-color: transparent;
} */
</style>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emits = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()
</script>

<script lang="ts">
import { defineComponent } from "vue"
import Lucide from "./icons/Lucide.vue";

export default defineComponent({
  expose: ["close", "open"],
  // data() {
  //   return {
  //     isOpen: false
  //   }
  // },
  methods: {
    close() {
      this.$emit("update:isOpen", false)
    },
    open() {
      this.$emit("update:isOpen", true)
    }
  }
})
</script>
