<template>
  <div
    :class="isOpen ? 'showcase active' : 'showcase'"
    @click.self="isOpen = !isOpen"
    @keypress.enter="isOpen = !isOpen"
    @keydown.esc="updateValue(selectedValue)"
    @blur="($event.relatedTarget as HTMLElement|null)?.hasAttribute(`data-dropdown-input`) ? '' : isOpen = false"
    tabindex="0"
  >
    {{ selectedValue.text }}
    <Transition>
      <div class="dropdown" v-show="isOpen">
        <div
          :class="selectedValue.val == opt.val ? 'option active' : 'option'"
          v-for="opt in options"
          @click="updateValue(opt)"
          @keypress.enter="updateValue(opt)"
          tabindex="0"
        >
          {{ opt.text }}
        </div>
        <input
          data-dropdown-input=""
          placeholder="Wybierz inną..."
          @blur="updateValue({
              val: ($event.target as HTMLInputElement).value,
              text: ($event.target as HTMLInputElement).value
            })"
          @input="
            updateValue({
              val: ($event.target as HTMLInputElement).value,
              text: ($event.target as HTMLInputElement).value
            }, false)
          "
          
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"

type OptT = { val: string; text: string }

type PropsT = {
  options: OptT[]
  modelValue: string
}

const props = defineProps<PropsT>()
</script>

<script lang="ts">
export default defineComponent({
  emits: ["update:modelValue", "input"],
  data() {
    return {
      isOpen: false,
      selectedValue: this.options[0]
    }
  },
  methods: {
    updateValue(v: OptT, close = true) {
      if (v.val.length == 0) {
        v = this.options[0]
      }

      if (close) {this.isOpen = false}

      this.selectedValue = v
      this.$emit("input")
      this.$emit("update:modelValue", v.val)
    }
  }
})
</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out, border-radius 150ms;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-33%) scale(1, 0.5);
}



.showcase {
  border: 2px solid var(--app-divider-color);
  border-radius: var(--app-border-radius);
  padding: 0.25rem;
  font-size: 1rem;
  height: 2rem;
  position: relative;
  user-select: none;
  min-width: 12rem;
}
.showcase.active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.dropdown {
  position: absolute;
  background-color: var(--app-background-color);
  left: -2px;
  right: -2px;
  margin-top: 0.25rem;
  border-bottom-left-radius: var(--app-border-radius);
  border-bottom-right-radius: var(--app-border-radius);
  border: 2px solid var(--app-divider-color);
  border-top: 0;
  display: flex;
  flex-direction: column;
}

.option {
  padding: 0.25rem;
  position: relative;
}
.option.active::after {
  content: "";
  float: left;
  height: 100%;
  width: 4rem;
  background: linear-gradient(
    to right,
    transparent,
    var(--app-accent-color-light)
  );
  opacity: 0.8;
  position: absolute;
  inset-block: 0;
  right: 0;
}
.option:not(:last-of-type) {
  border-bottom: 1px solid var(--app-divider-color);
}
</style>
