<template>
  <div class="contact-page min-h-screen">
    <div class="contact-vldl-container">
      <div class="contact-vldl-grid">
        <!-- 1. Left Column: Form (Full width rows) -->
        <div class="contact-vldl-form-col">
          <h1 class="contact-vldl-title">Gửi tin nhắn</h1>

          <form class="contact-vldl-form" @submit.prevent="submit">
            <!-- Họ và tên của bạn -->
            <div class="contact-vldl-field">
              <label for="contact-fullname">
                Họ và tên của bạn <span class="req">*</span>
              </label>
              <input
                id="contact-fullname"
                v-model="form.fullName"
                type="text"
                placeholder="Nhập họ và tên"
                autocomplete="name"
                :disabled="submitting"
              />
            </div>

            <!-- Email liên hệ -->
            <div class="contact-vldl-field">
              <label for="contact-email">
                Email liên hệ <span class="req">*</span>
              </label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                placeholder="email@example.com"
                autocomplete="email"
                :disabled="submitting"
              />
            </div>

            <!-- Chủ đề -->
            <div class="contact-vldl-field">
              <label for="contact-subject">
                Chủ đề <span class="req">*</span>
              </label>
              <select
                id="contact-subject"
                v-model="form.subject"
                :disabled="submitting"
              >
                <option value="" disabled>Chọn chủ đề</option>
                <option
                  v-for="item in subjectItems"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
            </div>

            <!-- Lời nhắn của bạn -->
            <div class="contact-vldl-field">
              <label for="contact-message">
                Lời nhắn của bạn <span class="req">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="6"
                maxlength="1000"
                placeholder="Nhập nội dung tin nhắn..."
                :disabled="submitting"
              />
            </div>

            <!-- Counter -->
            <div class="contact-vldl-counter">
              {{ messageCount }} / 1000
            </div>

            <!-- Full Width Submit Button -->
            <button
              type="submit"
              class="contact-vldl-submit-btn"
              :disabled="submitting"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>{{ submitting ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}</span>
            </button>
          </form>
        </div>

        <!-- 2. Right Column: Info & Socials -->
        <div class="contact-vldl-info-col">
          <h2 class="contact-vldl-title">Thông tin liên hệ</h2>

          <div class="contact-vldl-channel-list">
            <!-- Email -->
            <a
              v-if="email"
              :href="mailtoHref"
              class="contact-vldl-channel-item"
            >
              <span class="contact-vldl-icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <span class="contact-vldl-channel-text">
                <span class="label">Email</span>
                <span class="value">{{ email }}</span>
              </span>
            </a>

            <!-- Hotline -->
            <a
              v-if="phoneNumber"
              :href="telHref"
              class="contact-vldl-channel-item"
            >
              <span class="contact-vldl-icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span class="contact-vldl-channel-text">
                <span class="label">Hotline</span>
                <span class="value">{{ phoneNumber }}</span>
              </span>
            </a>

            <!-- Thời gian làm việc -->
            <div class="contact-vldl-channel-item is-static">
              <span class="contact-vldl-icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span class="contact-vldl-channel-text">
                <span class="label">Thời gian làm việc</span>
                <span class="value">Thứ Hai - Thứ Sáu, 8:00 - 18:00</span>
              </span>
            </div>
          </div>

          <!-- Social Links -->
          <div class="contact-vldl-social-wrap">
            <h3>Theo dõi chúng tôi</h3>
            <p>Theo dõi chúng tôi trên mạng xã hội để cập nhật tin tức và cơ hội mới nhất.</p>

            <div class="contact-vldl-social-row">
              <a
                href="#"
                class="contact-vldl-social-btn"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="#"
                class="contact-vldl-social-btn"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="#"
                class="contact-vldl-social-btn"
                aria-label="Pinterest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.2 4C7.9 4 5 6.9 5 10.8C5 13.3 6.4 15.3 8.7 15.3C9.2 15.3 9.4 13.9 9.4 13.6C9.4 13.2 8.4 12.4 8.4 10.7C8.4 8.1 10.4 6.2 12.9 6.2C15.1 6.2 16.8 7.4 16.8 9.8C16.8 12.1 15.8 16.5 12.8 16.5C11.8 16.5 11 15.6 11 14.6C11 13.1 12.1 11.7 12.1 10.1C12.1 7.4 8.3 7.9 8.3 12.7C8.3 13.7 8.4 14.7 8.9 15.5L7.6 20C7.1 21.6 7.5 22 9.1 21.3C11.4 20.2 11.7 18.8 12.2 16.4C12.8 17 13.6 17.4 14.7 17.4C18.6 17.4 20.7 13.6 20.7 10.1C20.7 6.3 17.5 4 12.2 4Z" />
                </svg>
              </a>

              <a
                href="#"
                class="contact-vldl-social-btn"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Liên hệ - TuyenGiaoVien.vn' })

const { email, phoneNumber, mailtoHref, telHref, loading } = useAdminContactInfo()

const submitting = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  subject: '',
  message: '',
})

const subjectItems = [
  { label: 'Hỗ trợ ứng viên', value: 'candidate_support' },
  { label: 'Hỗ trợ nhà tuyển dụng', value: 'employer_support' },
  { label: 'Góp ý website', value: 'website_feedback' },
  { label: 'Hợp tác kinh doanh', value: 'business_partnership' },
  { label: 'Khác', value: 'other' },
]

const messageCount = computed(() => Math.min(1000, (form.message || '').length))

watch(
  () => form.message,
  (v) => {
    if (!v) return
    if (v.length > 1000) form.message = v.slice(0, 1000)
  },
)

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const submit = async () => {
  const name = form.fullName.trim()
  const email = form.email.trim()
  const subject = form.subject
  const message = form.message.trim()

  if (!name || !email || !subject || !message) {
    useNotify({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*).' })
    return
  }

  if (!isEmail(email)) {
    useNotify({ type: 'error', message: 'Email không hợp lệ.' })
    return
  }

  submitting.value = true
  try {
    const { $api } = useNuxtApp()
    await $api.contact.submitMessage({
      fullName: name,
      email,
      subject,
      message,
    })
    useNotify({ type: 'success', message: 'Đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.' })
    form.fullName = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (e: unknown) {
    const err = e as { message?: string | string[] }
    const msg = Array.isArray(err.message)
      ? err.message[0]
      : err.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.'
    useNotify({ type: 'error', message: String(msg) })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/components/contact-page.scss';
</style>
