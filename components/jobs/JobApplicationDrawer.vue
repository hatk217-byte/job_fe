<template>
  <Teleport to="body">
    <Transition name="job-apply-slide">
      <aside
        v-if="open"
        ref="drawerPanelRef"
        class="job-apply-drawer-aside"
        role="dialog"
        aria-modal="false"
        aria-label="Hồ sơ ứng tuyển"
      >
        <!-- Header Row (Compact & clean with inline close button) -->
        <div class="apply-modal-header">
          <div class="apply-modal-header-info">
            <span class="apply-modal-eyebrow">Hồ sơ ứng tuyển</span>
            <h2 :title="job?.title">{{ job?.title || '' }}</h2>
            <p v-if="job?.companyName" :title="job.companyName">{{ job.companyName }}</p>
          </div>

          <button
            type="button"
            class="apply-modal-close"
            aria-label="Đóng hồ sơ ứng tuyển"
            @click="open = false"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <JobApplicationDrawerForm
          :user-info="userInfo"
          :loading="formSubmitting"
          @cancel="open = false"
          @submit="onSubmit"
        />
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import type { JobApplicationFormPayload } from '~/composables/useJobApplicationSubmit'
import { resolveUserPhoneNumber } from '~/utils/user-profile'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  job: Pick<JobModel, 'id' | 'title' | 'companyName'> | null
}>()

const emit = defineEmits<{
  success: [jobId: number]
}>()

const authStore = useAuthStore()
const { submitApplication } = useJobApplicationSubmit()
const { markJobAsApplied } = useAppliedJobs()
const formSubmitting = ref(false)
const drawerPanelRef = ref<HTMLElement | null>(null)

watch(open, async (isOpen) => {
  if (!isOpen) {
    formSubmitting.value = false
    return
  }

  if (authStore.isLoggedIn) {
    try {
      await authStore.getMe()
    }
    catch (error) {
      console.error('Failed to refresh user profile for apply drawer:', error)
    }
  }
})

// Close on Escape or click outside (wheel/scroll on JD remains completely free!)
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

function onDocumentPointerDown(e: PointerEvent) {
  if (!open.value || !drawerPanelRef.value) return
  const target = e.target as HTMLElement
  if (
    !drawerPanelRef.value.contains(target) &&
    !target.closest('.job-vldl-cta-btn') &&
    !target.closest('.apply-trigger-btn') &&
    !target.closest('.job-apply-trigger')
  ) {
    open.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onDocumentPointerDown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('pointerdown', onDocumentPointerDown)
  }
})

const userInfo = computed(() => {
  if (!authStore.isLoggedIn || !authStore.user) return null
  return {
    fullName: authStore.user.fullName || '',
    email: authStore.user.email || '',
    phone: resolveUserPhoneNumber(authStore.user.phoneNumber, authStore.user.email),
    cvUrl: authStore.user.cvUrl || null,
    coverLetterUrl: authStore.user.coverLetterUrl || null,
    coverLetterText: authStore.user.coverLetterText || null,
  }
})

async function onSubmit(data: JobApplicationFormPayload) {
  if (!props.job || formSubmitting.value) return

  formSubmitting.value = true
  try {
    const result = await submitApplication(props.job, data)
    if (!result.ok) return

    if (result.isNewUser) {
      open.value = false
      return
    }

    markJobAsApplied(props.job.id)
    emit('success', props.job.id)
    open.value = false
  } finally {
    formSubmitting.value = false
  }
}
</script>
