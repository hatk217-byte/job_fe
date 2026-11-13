<template>
  <div v-if="job" class="job-vldl-page">
    <div class="job-vldl-container">
      <!-- Breadcrumb -->
      <nav class="job-vldl-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <NuxtLink to="/">Trang chủ</NuxtLink>
            <span class="sep">/</span>
          </li>
          <li>
            <NuxtLink to="/jobs/search">Tìm việc làm</NuxtLink>
            <span class="sep">/</span>
          </li>
          <li class="active" :title="job.title">
            <span>{{ job.title }}</span>
          </li>
        </ol>
      </nav>

      <!-- Top Hero Header Card -->
      <section class="job-vldl-hero-card">
        <div class="job-vldl-hero-left">
          <div
            class="job-vldl-company-logo"
            :class="{ 'has-image': !!job.companyLogo }"
          >
            <img
              v-if="job.companyLogo"
              :src="job.companyLogo"
              :alt="`${job.companyName} logo`"
              loading="lazy"
            />
            <span v-else>{{ companyLogoLetters }}</span>
          </div>

          <div class="job-vldl-hero-info">
            <div class="job-vldl-company-row">
              <NuxtLink
                v-if="job.companyId"
                :to="`/companies/${job.companyId}`"
                class="job-vldl-company-name"
              >
                {{ job.companyName }}
              </NuxtLink>
              <span v-else class="job-vldl-company-name">{{ job.companyName }}</span>

              <span class="job-vldl-badge-verified">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Đã xác minh
              </span>

              <span
                v-if="preview"
                class="job-vldl-badge-preview"
              >
                Chế độ xem trước
              </span>
              <span
                v-else-if="showReviewStatus"
                class="job-vldl-badge-review"
              >
                Đang duyệt
              </span>
            </div>

            <h1 class="job-vldl-job-title">{{ job.title }}</h1>

            <div class="job-vldl-quick-meta">
              <div class="quick-meta-item is-salary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
                <span>{{ salaryText }}</span>
              </div>

              <div class="quick-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Hạn nộp: {{ deadlineText }}</span>
              </div>

              <div class="quick-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{{ fullLocationText || 'Toàn quốc' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="job-vldl-hero-right">
          <template v-if="preview">
            <span class="job-vldl-preview-tag">Bản xem trước</span>
          </template>
          <template v-else-if="effectiveShowApplyActions">
            <button
              v-if="!hasApplied"
              type="button"
              class="job-vldl-apply-btn"
              @click="emit('apply', job)"
            >
              Ứng tuyển ngay
            </button>
            <button
              v-else
              type="button"
              class="job-vldl-apply-btn is-applied"
              disabled
            >
              ✓ Đã ứng tuyển
            </button>
          </template>
        </div>
      </section>

      <!-- 2-Column Main Content Layout -->
      <div class="job-vldl-grid">
        <!-- LEFT COLUMN: Overview Card + Job Details Card -->
        <main class="job-vldl-col-main">
          <!-- Card 1: Tổng quan công việc -->
          <section class="job-vldl-card job-vldl-overview-card">
            <h2 class="job-vldl-card-title">Tổng quan công việc</h2>

            <div class="job-vldl-table">
              <div
                v-for="item in overviewFields"
                :key="item.label"
                class="job-vldl-table-row"
              >
                <div class="job-vldl-table-label">{{ item.label }}</div>
                <div
                  v-if="item.isHtml"
                  class="job-vldl-table-value rich-text-output"
                  v-html="item.value"
                />
                <div v-else class="job-vldl-table-value">{{ item.value }}</div>
              </div>
            </div>
          </section>

          <!-- Card 2: Mô tả chi tiết công việc -->
          <section class="job-vldl-card job-vldl-detail-card">
            <h2 class="job-vldl-card-title">Mô tả chi tiết công việc</h2>

            <!-- Chi tiết 1: Mô tả công việc -->
            <div class="job-vldl-section-block">
              <h3 class="job-vldl-section-subtitle">Mô tả công việc</h3>
              <div
                v-if="hasDetailDescription"
                class="job-detail-description rich-text-output"
                v-html="job.detailDescription"
              />
              <p v-else class="text-gray-500 italic">{{ $t('common.nanValue') }}</p>
            </div>

            <!-- Chi tiết 2: Yêu cầu ứng viên -->
            <div v-if="requirementsList.length" class="job-vldl-section-block">
              <h3 class="job-vldl-section-subtitle">Yêu cầu ứng viên</h3>
              <ul class="job-vldl-bullet-list">
                <li v-for="req in requirementsList" :key="req">
                  <span class="bullet-dot" />
                  <span>{{ req }}</span>
                </li>
              </ul>
            </div>

            <!-- Chi tiết 3: Quyền lợi -->
            <div v-if="processedBenefits.length" class="job-vldl-section-block">
              <h3 class="job-vldl-section-subtitle">Quyền lợi được hưởng</h3>
              <ul class="job-vldl-bullet-list">
                <li v-for="b in processedBenefits" :key="b">
                  <span class="bullet-dot" />
                  <span>{{ b }}</span>
                </li>
              </ul>
            </div>

            <!-- Chi tiết 4: Địa chỉ làm việc cụ thể -->
            <div v-if="hasJobAddress" class="job-vldl-section-block">
              <h3 class="job-vldl-section-subtitle">Địa điểm làm việc cụ thể</h3>
              <div
                class="job-detail-address rich-text-output"
                v-html="job.jobAddress || job.address"
              />
            </div>

            <!-- Bottom Inline Apply Callout -->
            <div v-if="effectiveShowApplyActions && !preview" class="job-vldl-bottom-cta">
              <div class="bottom-cta-text">
                <strong>Bạn thấy vị trí này phù hợp?</strong>
                <span>Hãy gửi hồ sơ ngay để nhà tuyển dụng có thể liên hệ sớm nhất.</span>
              </div>
              <button
                v-if="!hasApplied"
                type="button"
                class="job-vldl-apply-btn"
                @click="emit('apply', job)"
              >
                Ứng tuyển ngay
              </button>
              <button
                v-else
                type="button"
                class="job-vldl-apply-btn is-applied"
                disabled
              >
                ✓ Đã ứng tuyển
              </button>
            </div>
          </section>
        </main>

        <!-- RIGHT COLUMN: Sidebar -->
        <aside class="job-vldl-col-sidebar">
          <!-- Sidebar Card 1: Về nhà tuyển dụng -->
          <section class="job-vldl-card job-vldl-sidebar-card">
            <h3 class="sidebar-card-title">Về nhà tuyển dụng</h3>

            <div class="sidebar-company-header">
              <div
                class="sidebar-company-logo"
                :class="{ 'has-image': !!job.companyLogo }"
              >
                <img
                  v-if="job.companyLogo"
                  :src="job.companyLogo"
                  :alt="job.companyName"
                  loading="lazy"
                />
                <span v-else>{{ companyLogoLetters }}</span>
              </div>
              <div class="sidebar-company-meta">
                <h4 class="sidebar-company-title">{{ job.companyName }}</h4>
                <span class="job-vldl-badge-verified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Đã xác minh
                </span>
              </div>
            </div>

            <p class="sidebar-company-desc">
              {{ companyIntroText }}
            </p>

            <div v-if="fullLocationText" class="sidebar-location-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ fullLocationText }}</span>
            </div>

            <NuxtLink
              v-if="job.companyId"
              :to="`/companies/${job.companyId}`"
              class="sidebar-company-link"
            >
              <span>Xem trang hồ sơ công ty</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </NuxtLink>
          </section>

          <!-- Sidebar Card 2: Chia sẻ việc làm -->
          <section class="job-vldl-card job-vldl-sidebar-card">
            <h3 class="sidebar-card-title">Chia sẻ việc làm</h3>
            <p class="sidebar-share-desc">
              Biết ai đó đang tìm kiếm cơ hội này? Hãy chia sẻ tin tuyển dụng đến họ ngay nhé.
            </p>
            <button
              type="button"
              class="sidebar-share-btn"
              :class="{ 'is-copied': isCopied }"
              @click="copyShareLink"
            >
              <svg v-if="!isCopied" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ isCopied ? 'Đã sao chép liên kết!' : 'Bấm để chia sẻ tin tuyển dụng' }}</span>
            </button>
          </section>

          <!-- Sidebar Card 3: Lưu ý cho ứng viên -->
          <section class="job-vldl-card job-vldl-notice-card">
            <div class="notice-card-header">
              <span class="notice-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </span>
              <h4 class="notice-card-title">Lưu ý cho ứng viên</h4>
            </div>
            <ul class="notice-card-list">
              <li>Tuyệt đối không nộp bất kỳ khoản phí nào trong quá trình ứng tuyển hoặc phỏng vấn.</li>
              <li>Kiểm tra kỹ thông tin đơn vị tuyển dụng, địa điểm làm việc và mô tả công việc trước khi tham gia phỏng vấn.</li>
            </ul>
          </section>
        </aside>
      </div>

      <!-- SECTION 1 (VLDL style): Việc làm khác tại công ty/trường học đó -->
      <section v-if="companyOtherJobs && companyOtherJobs.length" class="job-vldl-other-jobs-section">
        <div class="job-vldl-card job-vldl-other-jobs-card">
          <div class="other-jobs-header">
            <h3 class="other-jobs-title">Việc làm khác tại {{ job.companyName }}</h3>
            <NuxtLink
              v-if="job.companyId"
              :to="`/companies/${job.companyId}`"
              class="view-all-link"
            >
              <span>Xem tất cả</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </NuxtLink>
          </div>

          <div class="other-jobs-list">
            <NuxtLink
              v-for="oj in companyOtherJobs.slice(0, 2)"
              :key="oj.id"
              :to="`/jobs/${oj.id}`"
              class="other-job-item"
            >
              <div class="other-job-left">
                <div class="other-job-logo" :class="{ 'has-image': !!(oj.imageLogo || job.companyLogo) }">
                  <img
                    v-if="oj.imageLogo || job.companyLogo"
                    :src="oj.imageLogo || job.companyLogo"
                    :alt="oj.title"
                    loading="lazy"
                  />
                  <span v-else>{{ companyLogoLetters }}</span>
                </div>
                <div class="other-job-info">
                  <h4 class="other-job-title">{{ oj.title }}</h4>
                  <div class="other-job-meta">
                    <span v-if="getOtherJobLocation(oj)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {{ getOtherJobLocation(oj) }}
                    </span>
                    <span class="meta-dot">·</span>
                    <span>{{ getOtherJobType(oj) }}</span>
                    <span class="meta-dot">·</span>
                    <span class="other-job-salary">{{ getOtherJobSalary(oj) }}</span>
                  </div>
                </div>
              </div>

              <div class="other-job-right">
                <span class="other-job-date">{{ formatOtherJobDate(oj.postedDate) }}</span>
                <svg class="other-job-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- SECTION 2 (VLDL style): Có thể bạn sẽ thích (Việc làm tương tự) -->
      <section v-if="showSimilarJobs && similarJobs.length" class="job-vldl-similar-section">
        <div class="similar-header-row">
          <div class="similar-header-left">
            <h2 class="similar-section-title">Có thể bạn sẽ thích</h2>
            <p class="similar-section-desc">
              Tìm hiểu thêm những cơ hội phù hợp với kỹ năng và định hướng phát triển của bạn.
            </p>
          </div>
          <NuxtLink to="/jobs/search" class="view-all-link">
            <span>Xem tất cả</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </NuxtLink>
        </div>

        <div class="similar-cards-grid">
          <NuxtLink
            v-for="sj in similarJobs.slice(0, 3)"
            :key="sj.id"
            :to="`/jobs/${sj.id}`"
            class="similar-job-card"
          >
            <div class="similar-card-top">
              <div class="similar-card-logo" :class="{ 'has-image': !!sj.companyLogo }">
                <img
                  v-if="sj.companyLogo"
                  :src="sj.companyLogo"
                  :alt="`${sj.companyName} logo`"
                  loading="lazy"
                />
                <span v-else>{{ (sj.companyName || 'CT').slice(0, 2).toUpperCase() }}</span>
              </div>

              <div class="similar-card-head-content">
                <h3 class="similar-card-title">{{ sj.title }}</h3>
                <p class="similar-card-company">{{ sj.companyName }}</p>
              </div>

              <span class="similar-card-fire" title="Việc làm hot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.92 3.84-9.36 6.89-12.06.4-.35.99-.21 1.2.29.98 2.27 2.7 4.09 3.91 5.37.28.29.74.22.92-.14.73-1.42 1.61-3.66 1.15-5.96-.08-.41.28-.78.7-.72 4.16.59 7.23 4.8 7.23 8.22 0 4.97-4.03 9-9 9zm-.5-5.5c1.93 0 3.5-1.57 3.5-3.5 0-1.88-1.55-3.41-3.23-4.88-.23-.2-.58-.09-.67.19-.51 1.63-1.6 3.19-1.6 4.69 0 1.93 1.57 3.5 2 3.5z"/>
                </svg>
              </span>
            </div>

            <div class="similar-card-bottom">
              <div class="similar-card-meta">
                <span v-if="getFullLocationTextFor(sj)" class="similar-card-loc">
                  📍 {{ getFullLocationTextFor(sj).split(',')[0] }}
                </span>
                <span v-if="getFullLocationTextFor(sj) && sj.createdAt" class="meta-dot">·</span>
                <span v-if="sj.createdAt" class="similar-card-time">
                  {{ timeAgoFor(sj.createdAt) }}
                </span>
              </div>
              <div class="similar-card-salary">
                {{ formatSalaryRange(sj) }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { hasRichTextContent } from '~/utils/rich-text'
import { formatDate } from '~/utils/helper'
import { formatSalaryRange } from '~/utils/formatSalary'

const props = withDefaults(
  defineProps<{
    job: JobModel
    preview?: boolean
    previewStatusLabel?: string
    showSimilarJobs?: boolean
    showApplyActions?: boolean
    hasApplied?: boolean
    similarJobs?: JobModel[]
    companyOtherJobs?: any[]
  }>(),
  {
    preview: false,
    previewStatusLabel: '',
    showSimilarJobs: false,
    showApplyActions: true,
    hasApplied: false,
    similarJobs: () => [],
    companyOtherJobs: () => [],
  },
)

const emit = defineEmits<{
  apply: [job: JobModel]
  viewSimilar: [job: JobModel]
}>()

const { ensureLoaded, hasAppliedToJob, canApplyToJobs } = useAppliedJobs()
const { locationEnumLabel, employmentTypesEnumLabel } = useJobFilters()

const effectiveShowApplyActions = computed(
  () => props.showApplyActions && canApplyToJobs.value,
)

onMounted(() => {
  if (effectiveShowApplyActions.value && !props.preview) {
    ensureLoaded()
  }
})

const jobRef = computed(() => props.job)

const hasDetailDescription = computed(() =>
  hasRichTextContent(props.job.detailDescription),
)
const hasJobAddress = computed(() =>
  hasRichTextContent(props.job.jobAddress || props.job.address),
)

const {
  companyLogoLetters,
  showReviewStatus,
  processedBenefits,
  requirementsList,
  salaryText,
  salaryTypeText,
  fullLocationText,
  postedText,
  deadlineText,
  categoryText,
  employmentTypeText,
  gradeText,
  qualificationText,
  experienceText,
  genderText,
  benefitsPreview,
  getFullLocationTextFor,
  timeAgoFor,
} = useJobDetailView(jobRef)

const overviewFields = computed(() => {
  const hasAddr = hasRichTextContent(props.job.jobAddress || props.job.address)
  return [
    { label: 'Ngày đăng tin', value: postedText.value },
    { label: 'Hạn nộp hồ sơ', value: deadlineText.value },
    { label: 'Lĩnh vực / Bộ môn', value: categoryText.value },
    { label: 'Hình thức làm việc', value: employmentTypeText.value },
    { label: 'Cấp học / Khối', value: gradeText.value },
    { label: 'Bằng cấp / Trình độ', value: qualificationText.value },
    { label: 'Mức lương', value: salaryText.value },
    { label: 'Loại lương', value: salaryTypeText.value },
    { label: 'Yêu cầu kinh nghiệm', value: experienceText.value },
    { label: 'Yêu cầu giới tính', value: genderText.value },
    { label: 'Khu vực làm việc', value: fullLocationText.value || 'Toàn quốc' },
    {
      label: 'Địa chỉ cụ thể',
      value: hasAddr ? (props.job.jobAddress || props.job.address) : 'Theo thỏa thuận khi trao đổi',
      isHtml: hasAddr,
    },
    { label: 'Phúc lợi', value: benefitsPreview.value },
  ]
})

const companyIntroText = computed(() => {
  if (props.job.note?.trim()) return props.job.note.trim()
  return `${props.job.companyName || 'Đơn vị tuyển dụng'} là đơn vị giáo dục uy tín tuyển dụng thông qua nền tảng TuyenGiaoVien.vn.`
})

const getOtherJobLocation = (oj: any) => {
  if (!oj.location) return ''
  const loc = String(oj.location).split(',')[0]?.trim()
  if (!loc || loc === '0') return 'Toàn quốc'
  return (
    (locationEnumLabel as Record<string, string>)?.[loc] ??
    (locationEnumLabel as Record<number, string>)?.[Number(loc)] ??
    loc
  )
}

const getOtherJobType = (oj: any) => {
  if (!oj.typeOfEmployment) return 'Toàn thời gian'
  const raw = String(oj.typeOfEmployment)
  const labels = raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => {
      return (
        (employmentTypesEnumLabel as Record<string, string>)?.[k] ??
        (employmentTypesEnumLabel as Record<number, string>)?.[Number(k)] ??
        k
      )
    })
  return labels.length > 0 ? labels.join(' / ') : raw
}

const getOtherJobSalary = (oj: any) => {
  return formatSalaryRange(oj)
}

const formatOtherJobDate = (d?: Date | string) => {
  if (!d) return ''
  return formatDate(new Date(d))
}

const isCopied = ref(false)
const copyShareLink = async () => {
  try {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href)
      isCopied.value = true
      useNotify({ message: 'Đã sao chép liên kết việc làm!', type: 'success' })
      setTimeout(() => {
        isCopied.value = false
      }, 3000)
    }
  } catch {
    // ignore
  }
}
</script>
