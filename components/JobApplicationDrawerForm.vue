<template>
  <form class="apply-modal-form" @submit.prevent="submit">
    <!-- 1. CV CỦA BẠN (Top Box matching VLDL) -->
    <section class="apply-vldl-cv-box">
      <h3 class="apply-vldl-cv-title">CV của bạn <span class="is-required">*</span></h3>

      <!-- When CV is chosen/uploaded -->
      <div v-if="hasCvFile" class="apply-vldl-cv-selected">
        <div class="apply-vldl-cv-file-info">
          <span class="apply-vldl-cv-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <div class="apply-vldl-cv-name-wrap">
            <strong class="apply-vldl-cv-name">{{ cvFileName }}</strong>
            <span class="apply-vldl-cv-status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ form.cvFile ? 'Đã chọn tệp' : 'Đã tải lên' }}
            </span>
          </div>
        </div>

        <label class="apply-vldl-change-cv-btn">
          <input
            ref="cvInput"
            type="file"
            accept=".doc,.docx,.pdf"
            hidden
            @change="onCvSelected"
          />
          <span>Đổi CV khác</span>
        </label>
      </div>

      <!-- When no CV chosen yet -->
      <div v-else class="apply-vldl-cv-empty">
        <label class="apply-vldl-upload-btn">
          <input
            ref="cvInput"
            type="file"
            accept=".doc,.docx,.pdf"
            hidden
            @change="onCvSelected"
          />
          <span>Tải lên CV</span>
        </label>
        <p class="apply-vldl-cv-hint">
          Vui lòng tải lên tệp .doc, .docx hoặc .pdf, tối đa 3MB và không có mật khẩu bảo vệ
        </p>
      </div>

      <p v-if="cvError" class="apply-modal-field-error" role="alert">{{ cvError }}</p>
    </section>

    <!-- 2. HỌ VÀ TÊN -->
    <label
      class="apply-modal-field"
      :class="{ 'has-error': fieldErrors.fullName }"
    >
      <span class="field-label">Họ và tên <span class="is-required">*</span></span>
      <div class="field-input-wrap">
        <input
          v-model="form.fullName"
          type="text"
          placeholder="Nhập họ và tên đầy đủ của bạn"
          :disabled="isFullNameDisabled"
          @input="onFullNameInput"
          @blur="validateFieldOnBlur('fullName')"
        />
      </div>
      <p v-if="fieldErrors.fullName" class="apply-modal-field-error" role="alert">
        {{ fieldErrors.fullName }}
      </p>
    </label>

    <!-- 3. EMAIL LIÊN HỆ -->
    <label
      class="apply-modal-field"
      :class="{ 'has-error': fieldErrors.email }"
    >
      <span class="field-label">Email liên hệ <span class="is-required">*</span></span>
      <div class="field-input-wrap has-trailing-icon">
        <input
          v-model="form.email"
          type="email"
          placeholder="Nhập địa chỉ email của bạn"
          :disabled="isEmailDisabled"
          @blur="validateFieldOnBlur('email')"
          @input="clearFieldError('email')"
        />
        <svg class="field-trailing-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>
      <p v-if="fieldErrors.email" class="apply-modal-field-error" role="alert">
        {{ fieldErrors.email }}
      </p>
    </label>

    <!-- 4. SỐ ĐIỆN THOẠI -->
    <label
      class="apply-modal-field"
      :class="{ 'has-error': fieldErrors.phone }"
    >
      <span class="field-label">Số điện thoại <span class="is-required">*</span></span>
      <div class="field-input-wrap has-trailing-icon">
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Nhập số điện thoại liên hệ"
          :disabled="isPhoneDisabled"
          @blur="validateFieldOnBlur('phone')"
          @input="clearFieldError('phone')"
        />
        <svg class="field-trailing-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
      <p v-if="fieldErrors.phone" class="apply-modal-field-error" role="alert">
        {{ fieldErrors.phone }}
      </p>
    </label>

    <!-- 5. COVER LETTER -->
    <label class="apply-modal-field apply-modal-field-textarea">
      <span class="field-label">Thư giới thiệu / Cover Letter (Không bắt buộc)</span>
      <div class="field-textarea-wrap">
        <textarea
          v-model="form.coverLetter"
          rows="3"
          maxlength="1000"
          placeholder="Hãy điền thêm thông tin để nhà tuyển dụng biết rõ hơn về thế mạnh của bạn"
        />
        <div class="apply-textarea-counter">{{ coverLetterCount }} / 1000</div>
      </div>
    </label>

    <!-- 6. TERMS AGREEMENT CHECKBOX (Matching VLDL) -->
    <label class="apply-vldl-terms-row">
      <input v-model="termsAgreed" type="checkbox" class="apply-vldl-checkbox" />
      <span class="terms-text">
        Tôi đồng ý với
        <NuxtLink to="/terms" target="_blank" class="terms-link">Điều khoản dịch vụ</NuxtLink>
        và
        <NuxtLink to="/privacy" target="_blank" class="terms-link">Chính sách bảo mật</NuxtLink>
        của TuyenGiaoVien khi nộp đơn ứng tuyển.
      </span>
    </label>

    <!-- 7. ACTIONS (Orange Submit Button) -->
    <div class="apply-modal-actions">
      <button
        type="submit"
        class="apply-vldl-submit-btn"
        :disabled="!isValid || !termsAgreed || loading"
      >
        <span v-if="!loading">Nộp đơn</span>
        <span v-else>Đang gửi hồ sơ...</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  handleAuthFullNameInput,
  validateAuthEmail,
  validateAuthFullName,
  validateAuthPhone,
} from '~/utils/auth-field-validation'

interface Props {
  userInfo?: {
    fullName: string
    email: string
    phone?: string
    cvUrl?: string | null
    coverLetterText?: string | null
    coverLetterUrl?: string | null
  } | null
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: {
    fullName: string
    phone: string
    email: string
    cvFile: File | null
    cvUrl?: string | null
    coverLetter: string
    coverLetterFile: File | null
    coverLetterUrl?: string | null
  }): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})
const emit = defineEmits<Emits>()
const cvInput = ref<HTMLInputElement | null>(null)
const cvError = ref('')
const termsAgreed = ref(true)

const fieldErrors = reactive({
  fullName: '',
  email: '',
  phone: '',
})

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  cvFile: null as File | null,
  cvUrl: null as string | null,
  coverLetter: '',
  coverLetterUrl: null as string | null,
})

const isFullNameDisabled = computed(() => {
  const value = props.userInfo?.fullName?.trim() || ''
  return !!value && validateAuthFullName(value) === ''
})

const isEmailDisabled = computed(() => {
  const value = props.userInfo?.email?.trim() || ''
  return !!value && validateAuthEmail(value) === ''
})

const isPhoneDisabled = computed(() => {
  const value = props.userInfo?.phone?.trim() || ''
  return !!value && validateAuthPhone(value) === ''
})

const hasCvFile = computed(() => !!(form.cvFile || form.cvUrl))

const cvFileName = computed(() => {
  if (form.cvFile) return form.cvFile.name
  if (form.cvUrl) {
    try {
      const parts = form.cvUrl.split('/')
      return decodeURIComponent(parts[parts.length - 1] || 'CV.pdf')
    } catch {
      return 'CV.pdf'
    }
  }
  return ''
})

const coverLetterCount = computed(() => form.coverLetter.length)

watch(
  () => props.userInfo,
  (info) => {
    clearFieldErrors()
    if (!info) return
    form.fullName = info.fullName || ''
    form.email = info.email || ''
    form.phone = info.phone || ''
    form.cvUrl = info.cvUrl || null
    form.coverLetter = info.coverLetterText || ''
    form.coverLetterUrl = info.coverLetterUrl || null
  },
  { immediate: true },
)

const hasFormatErrors = () => {
  const fullNameError = isFullNameDisabled.value
    ? ''
    : validateAuthFullName(form.fullName)
  const emailError = isEmailDisabled.value
    ? ''
    : validateAuthEmail(form.email)
  const phoneError = isPhoneDisabled.value
    ? ''
    : validateAuthPhone(form.phone)

  return !!(fullNameError || emailError || phoneError)
}

const isValid = computed(() => {
  return (
    form.fullName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    (!!form.cvFile || !!form.cvUrl) &&
    !fieldErrors.fullName &&
    !fieldErrors.email &&
    !fieldErrors.phone &&
    !hasFormatErrors()
  )
})

function clearFieldErrors() {
  fieldErrors.fullName = ''
  fieldErrors.email = ''
  fieldErrors.phone = ''
}

function clearFieldError(field: keyof typeof fieldErrors) {
  fieldErrors[field] = ''
}

function validateFieldOnBlur(field: keyof typeof fieldErrors) {
  if (field === 'fullName') {
    if (isFullNameDisabled.value) {
      fieldErrors.fullName = ''
      return
    }
    fieldErrors.fullName = validateAuthFullName(form.fullName)
    return
  }

  if (field === 'email') {
    if (isEmailDisabled.value) {
      fieldErrors.email = ''
      return
    }
    fieldErrors.email = validateAuthEmail(form.email)
    return
  }

  if (isPhoneDisabled.value) {
    fieldErrors.phone = ''
    return
  }
  fieldErrors.phone = validateAuthPhone(form.phone)
}

function validateAllFields() {
  validateFieldOnBlur('fullName')
  validateFieldOnBlur('email')
  validateFieldOnBlur('phone')
}

function onFullNameInput(event: Event) {
  if (isFullNameDisabled.value) return

  handleAuthFullNameInput(
    event,
    (value) => {
      form.fullName = value
    },
    () => {
      fieldErrors.fullName = ''
    },
  )
}

function onCvSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  cvError.value = ''
  if (!file) return

  const maxSize = 3 * 1024 * 1024
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  if (file.size > maxSize) {
    cvError.value = 'File tối đa 3MB'
    input.value = ''
    return
  }

  if (!allowedTypes.includes(file.type)) {
    cvError.value = 'Chỉ hỗ trợ PDF, DOC, DOCX'
    input.value = ''
    return
  }

  form.cvFile = file
  form.cvUrl = null
}

function submit() {
  validateAllFields()
  if (!isValid.value || !termsAgreed.value || props.loading) return
  emit('submit', {
    fullName: form.fullName,
    phone: form.phone,
    email: form.email,
    cvFile: form.cvFile,
    cvUrl: form.cvUrl,
    coverLetter: form.coverLetter,
    coverLetterFile: null,
    coverLetterUrl: form.coverLetterUrl,
  })
}
</script>
