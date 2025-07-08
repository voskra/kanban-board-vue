<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import Button from '@/components/AppButton/AppButton.vue'
import Icon from '@/components/AppIcon/AppIcon.vue'
import type { Card } from '@/types/card.ts'
import styles from './BoardCard.module.scss'
import { useBoardStore } from '@/stores/useBoardStore.ts'

const props = defineProps<{
  card: Card
  disabled?: boolean
  isNew?: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'save', card: Card): void
  (e: 'cancel'): void
}>()

const board = useBoardStore()

const isEditing = ref(false)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)

const editedTitle = ref(props.card.title)
const editedDescription = ref(props.card.description)

const hasChanges = computed(
  () =>
    editedTitle.value !== props.card.title || editedDescription.value !== props.card.description,
)

watch(
  () => props.isNew,
  (isNew) => {
    if (isNew) {
      startEditing()
    }
  },
  { immediate: true },
)

watch(
  () => props.disabled,
  (newVal) => {
    if (newVal && isEditing.value) {
      cancel()
    }
  },
)

function startEditing() {
  if (isEditing.value || props.disabled) {
    return
  }

  isEditing.value = true
  nextTick(() => {
    titleRef.value!.innerText = props.card.title || ''
    titleRef.value?.focus()

    if (descRef.value) {
      descRef.value.innerHTML = props.card.description || ''
    }
  })
}

function onTitleInput() {
  editedTitle.value = titleRef.value?.innerText.trim() || ''
}

function onDescriptionInput() {
  editedDescription.value = descRef.value?.innerHTML || ''
}

function save() {
  editedTitle.value = titleRef.value?.innerText.trim() || ''

  editedDescription.value = descRef.value?.innerHTML || ''

  const updatedCard = {
    ...props.card,
    title: editedTitle.value,
    description: editedDescription.value,
  }

  emit('save', updatedCard)

  isEditing.value = false

  nextTick(() => {
    descRef.value?.scrollTo(0, 0)
  })
}

function cancel() {
  if (props.isNew) {
    emit('cancel')
  } else {
    editedTitle.value = props.card.title

    nextTick(() => {
      if (descRef.value) {
        descRef.value.innerHTML = props.card.description || ''
        descRef.value.scrollTo(0, 0)
      }
    })
  }

  isEditing.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (document.activeElement === descRef.value && event.key === 'Enter') {
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    save()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}

function onRightClick() {
  const confirmed = confirm(
    `Are you sure you want to delete card "${props.card.title || 'Untitled'}"?`,
  )

  if (confirmed) {
    emit('delete', props.card.id)
  }
}

function onDragStart() {
  board.setDraggedCard(props.card)
}

function onDragEnd() {
  board.setDraggedCard(null)
}
</script>

<template>
  <div
    :class="[styles.root, isEditing && styles.active, disabled && styles.disabled]"
    @dblclick="startEditing"
    @keydown="onKeydown"
    @contextmenu.prevent="onRightClick"
    tabindex="0"
    :draggable="!isEditing && !disabled"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div :class="styles.draggableButton">
      <Icon name="dragAndDrop" />
    </div>

    <div
        :class="[styles.title, !isEditing && styles.display]"
        :contenteditable="isEditing"
        ref="titleRef"
        @input="onTitleInput"
        @keydown.enter.prevent
    >
      {{ card.title }}
    </div>
    <div
      :class="[styles.description, !isEditing && styles.display]"
      :contenteditable="isEditing"
      v-html="card.description"
      ref="descRef"
      @input="onDescriptionInput"
    />
    <div v-if="isEditing" :class="styles.actions">
      <Button icon="light" iconColor="blue" @click="save" :disabled="!hasChanges">
        Save Changes
      </Button>
      <Button icon="minus" @click="cancel"> Cancel </Button>
    </div>
  </div>
</template>
