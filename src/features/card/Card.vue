<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import Button from '@/components/Button/Button.vue'
import Icon from '@/components/Icon/Icon.vue'
import type { Card } from '@/types/card.ts'
import styles from './Card.module.scss'

const props = defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

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
    () => props.card.isNew,
    (isNew) => {
      if (isNew) {
        startEditing();
      }
    },
    { immediate: true }
)

function startEditing() {
  if (isEditing.value) {
    return;
  }

    isEditing.value = true
    nextTick(() => {
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
  props.card.title = editedTitle.value

  editedDescription.value = descRef.value?.innerHTML || ''
  props.card.description = editedDescription.value

  props.card.isNew = false

  isEditing.value = false
}

function cancel() {
  if (props.card.isNew) {
    const confirmed = confirm('Discard this new card?')
    if (confirmed) {
      emit('delete', props.card.id)
    }

    return
  } else {
    editedTitle.value = props.card.title

    nextTick(() => {
      if (descRef.value) {
        descRef.value.innerHTML = props.card.description || ''
      }
    })

    isEditing.value = false
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && props.card.isNew && editedTitle.value) {
    event.preventDefault()
    save()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}

function onRightClick() {
  const confirmed = confirm(`Are you sure you want to delete card "${props.card.title || 'Untitled'}"?`)

  if (confirmed) {
    emit('delete', props.card.id)
  }
}
</script>

<template>
  <div :class="[styles.root, isEditing && styles.active]"
       @dblclick="startEditing"
       @keydown="onKeydown"
       @contextmenu.prevent="onRightClick"
       tabindex="0"
  >
    <div :class="styles.draggableButton">
      <Icon name="dragAndDrop" />
    </div>

    <div :class="[styles.title, !isEditing && styles.display]"
         :contenteditable="isEditing"
         ref="titleRef"
         @input="onTitleInput"
         @keydown.enter.prevent
    >
      {{ isEditing ? editedTitle : (card.title || 'Add title') }}
    </div>
    <div :class="[styles.description, !isEditing && styles.display]"
         :contenteditable="isEditing"
         v-html="card.description || 'Add description'"
         ref="descRef"
         @input="onDescriptionInput"
    />
    <div v-if="isEditing" :class="styles.actions">
      <Button icon="light" iconColor="blue" @click="save" :disabled="!hasChanges">
        Save Changes
      </Button>
      <Button icon="minus" @click="cancel">
        Cancel
      </Button>
    </div>
  </div>
</template>
