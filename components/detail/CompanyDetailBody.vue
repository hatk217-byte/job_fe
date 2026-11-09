<template>
  <div v-if="company" class="company-vldl-page">
    <!-- Top Hero Section (FULL WHITE BACKGROUND) -->
    <section class="company-vldl-top-hero">
      <div class="company-vldl-container">
        <!-- Breadcrumb -->
        <nav class="company-vldl-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <NuxtLink to="/">Trang chủ</NuxtLink>
              <span class="sep">/</span>
            </li>
            <li>
              <NuxtLink to="/companies">Nhà tuyển dụng</NuxtLink>
              <span class="sep">/</span>
            </li>
            <li class="active" :title="formattedCompanyName">
              <span>{{ formattedCompanyName }}</span>
            </li>
          </ol>
        </nav>

        <!-- Hero Header Info -->
        <div class="company-vldl-hero-header">
          <div class="company-vldl-hero-left">
            <div
              class="company-vldl-logo"
              :class="{ 'has-image': !!company.logo }"
            >
              <img
                v-if="company.logo"
                :src="company.logo"
                :alt="`${formattedCompanyName} logo`"
                loading="lazy"
              />
              <span v-else>{{ logoFallback }}</span>
            </div>

            <div class="company-vldl-hero-info">
              <div class="company-vldl-title-row">
                <h1 class="company-vldl-name">{{ formattedCompanyName }}</h1>
                <span class="company-vldl-badge-verified">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Đã xác minh
                </span>
                <span v-if="preview" class="company-vldl-badge-preview">Chưa duyệt</span>
              </div>

              <div class="company-vldl-quick-meta">
                <div v-if="heroMetaLocation" class="quick-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{{ heroMetaLocation }}</span>
                </div>

                <span v-if="heroMetaLocation && companyJobsCount > 0" class="meta-dot">•</span>

                <div v-if="companyJobsCount > 0" class="quick-meta-item is-jobs">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <a href="#hiring-jobs" class="jobs-count-link">{{ companyJobsCount }} việc làm đang tuyển</a>
                </div>
              </div>
            </div>
          </div>

          <div class="company-vldl-hero-right">
            <!-- Share Button -->
            <button
              type="button"
              class="company-vldl-share-btn"
              :class="{ 'is-copied': isCopied }"
              :title="isCopied ? 'Đã sao chép liên kết!' : 'Chia sẻ nhà tuyển dụng'"
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
            </button>

            <!-- Orange Button: Xem việc làm -->
            <button
              v-if="companyJobsCount > 0"
              type="button"
              class="company-vldl-cta-btn"
              @click="scrollToJobs"
            >
              Xem việc làm ({{ companyJobsCount }})
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Body (Background var(--bg)) -->
    <div class="company-vldl-content-body">
      <div class="company-vldl-container">
        <!-- 2-Column Layout -->
        <div class="company-vldl-grid">
        <!-- LEFT COLUMN: Giới thiệu + Hình ảnh hoạt động -->
        <main class="company-vldl-col-main">
          <!-- Card 1: Giới thiệu công ty -->
          <section class="company-vldl-card">
            <h2 class="company-vldl-card-title">Giới thiệu công ty</h2>

            <div v-if="company.website" class="company-vldl-website-row">
              <span class="website-label">Website:</span>
              <a
                :href="companyWebsiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="company-vldl-website-link"
              >
                {{ company.website }}
              </a>
            </div>

            <div
              v-if="hasCompanyDescription"
              class="company-detail-description rich-text-output"
              v-html="company.description"
            />
            <p v-else class="text-gray-500 italic">
              {{ $t('common.nanValue') }}
            </p>

            <!-- Overview & Insight if available -->
            <div v-if="hasCompanyOverview" class="company-vldl-subblock">
              <h3 class="company-vldl-subblock-title">Tổng quan</h3>
              <p class="company-vldl-subblock-text">{{ company.overview }}</p>
            </div>

            <div v-if="hasCompanyInsight" class="company-vldl-subblock">
              <h3 class="company-vldl-subblock-title">Tầm nhìn</h3>
              <p class="company-vldl-subblock-text">{{ company.insight }}</p>
            </div>
          </section>

          <!-- Card 2: Hình ảnh hoạt động -->
          <section v-if="galleryDisplayImages.length" class="company-vldl-card">
            <h2 class="company-vldl-card-title">Hình ảnh hoạt động</h2>

            <div class="company-vldl-photos-grid">
              <div
                v-for="(image, idx) in galleryDisplayImages"
                :key="`${image.url}-${idx}`"
                class="company-vldl-photo-item"
                @click="openGallery(idx)"
              >
                <img :src="image.url" :alt="image.alt" loading="lazy" />
                <div class="photo-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <!-- Video Section if available -->
          <section v-if="company.videoUrl" class="company-vldl-card">
            <h2 class="company-vldl-card-title">Video giới thiệu</h2>
            <div
              class="company-single-video"
              :style="{ '--company-video-poster': `url('${videoPosterUrl}')` }"
              @click="openVideo"
            >
              <div class="company-single-video-play" aria-hidden="true">▶</div>
            </div>
          </section>
        </main>

        <!-- RIGHT COLUMN: Tổng quan nhà tuyển dụng + Việc làm đang tuyển -->
        <aside class="company-vldl-col-sidebar">
          <!-- Sidebar Card 1: Tổng quan nhà tuyển dụng -->
          <section class="company-vldl-card company-vldl-overview-card">
            <div class="overview-card-header">
              <h3 class="overview-card-title">Tổng quan nhà tuyển dụng</h3>
            </div>

            <div class="overview-card-body">
              <div v-for="item in companyOverviewItems" :key="item.label" class="overview-row">
                <div class="overview-label">{{ item.label }}</div>
                <div class="overview-value">{{ item.value }}</div>
              </div>
            </div>
          </section>

          <!-- Sidebar Card 2: Việc làm đang tuyển -->
          <section id="hiring-jobs-section" class="company-vldl-jobs-section">
            <div class="hiring-jobs-header">
              <h3 class="hiring-jobs-title">Việc làm đang tuyển</h3>
              <span v-if="companyJobsCount > 0" class="hiring-jobs-badge">
                {{ companyJobsCount }} việc làm
              </span>
            </div>

            <div v-if="company.jobs && company.jobs.length" class="hiring-jobs-list">
              <NuxtLink
                v-for="jobItem in paginatedJobs"
                :key="jobItem.id"
                :to="`/jobs/${jobItem.id}`"
                class="hiring-job-card"
              >
                <div class="hiring-job-top">
                  <div
                    class="hiring-job-logo"
                    :class="{ 'has-image': !!(jobItem.imageLogo || company.logo) }"
                  >
                    <img
                      v-if="jobItem.imageLogo || company.logo"
                      :src="jobItem.imageLogo || company.logo || ''"
                      :alt="company.name"
                      loading="lazy"
                    />
                    <span v-else>{{ logoFallback }}</span>
                  </div>
                  <div class="hiring-job-info">
                    <h4 class="hiring-job-title">{{ jobItem.title }}</h4>
                    <p class="hiring-job-company">{{ company.name }}</p>
                  </div>
                </div>

                <div class="hiring-job-bottom">
                  <div class="hiring-job-meta">
                    <span v-if="getFullLocationText(jobItem)">
                      📍 {{ getFullLocationText(jobItem).split(',')[0] }}
                    </span>
                    <span v-if="getFullLocationText(jobItem) && jobItem.postedDate" class="meta-dot">·</span>
                    <span v-if="jobItem.postedDate">
                      {{ timeAgo(jobItem.postedDate) }}
                    </span>
                  </div>
                  <div class="hiring-job-salary">
                    {{ formatSalaryRange(jobItem) }}
                  </div>
                </div>
              </NuxtLink>

              <!-- Phân trang gọn khi danh sách nhiều việc -->
              <div v-if="totalJobsPages > 1" class="hiring-jobs-pagination">
                <button
                  type="button"
                  class="hiring-page-btn nav-btn"
                  :disabled="currentJobsPage === 1"
                  title="Trang trước"
                  @click="currentJobsPage--"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div class="hiring-page-numbers">
                  <button
                    v-for="p in totalJobsPages"
                    :key="p"
                    type="button"
                    class="hiring-page-btn"
                    :class="{ 'is-active': p === currentJobsPage }"
                    @click="currentJobsPage = p"
                  >
                    {{ p }}
                  </button>
                </div>

                <button
                  type="button"
                  class="hiring-page-btn nav-btn"
                  :disabled="currentJobsPage === totalJobsPages"
                  title="Trang tiếp"
                  @click="currentJobsPage++"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <!-- Link xem toàn bộ khi nhiều hơn 4 việc -->
              <div v-if="companyJobsCount > JOBS_PER_PAGE" class="hiring-jobs-view-all">
                <NuxtLink
                  :to="`/jobs/search?keyword=${encodeURIComponent(company.name)}`"
                  class="view-all-jobs-link"
                >
                  <span>Xem tất cả ({{ companyJobsCount }})</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <div v-else class="hiring-jobs-empty">
              <p>Hiện tại đơn vị chưa có vị trí tuyển dụng mới nào.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
    </div>

    <!-- Gallery Lightbox Modal -->
    <div
      class="company-gallery-modal"
      :hidden="!galleryModalOpen"
      @keydown.escape="closeGallery"
      @click.self="closeGallery"
    >
      <button
        type="button"
        class="company-gallery-modal-backdrop"
        aria-label="Đóng"
        @click="closeGallery"
      />
      <div
        class="company-gallery-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Xem ảnh lớn"
        @click.stop
      >
        <button
          v-if="galleryModalImages.length > 1"
          type="button"
          class="company-gallery-modal-nav is-prev"
          aria-label="Ảnh trước"
          @click.stop="galleryPrev"
        >
          ‹
        </button>
        <button
          v-if="galleryModalImages.length > 1"
          type="button"
          class="company-gallery-modal-nav is-next"
          aria-label="Ảnh tiếp theo"
          @click.stop="galleryNext"
        >
          ›
        </button>
        <img
          v-if="galleryModalImages[galleryIndex]"
          :src="galleryModalImages[galleryIndex]?.url"
          :alt="galleryModalImages[galleryIndex]?.alt"
          class="company-gallery-modal-image"
        />
      </div>
    </div>

    <!-- Video Modal -->
    <UModal v-model:open="videoOpen" :ui="{ content: 'w-full sm:max-w-4xl' }">
      <template #body>
        <div class="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            v-if="videoEmbedUrl"
            :src="videoEmbedUrl"
            class="h-full w-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <video
            v-else-if="company.videoUrl"
            class="h-full w-full"
            controls
            :src="company.videoUrl"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { CompanyEntity, CompanyJobSummary } from '~/entities/company'
import { getCompanySizeLabel } from '~/constants/company-size'
import { hasRichTextContent } from '~/utils/rich-text'
import { formatSalaryRange } from '~/utils/formatSalary'
import { formatCompanyName } from '~/utils/formatCompanyName'

const props = withDefaults(
  defineProps<{
    company: CompanyEntity
    preview?: boolean
    showHiringJobs?: boolean
  }>(),
  {
    preview: false,
    showHiringJobs: true,
  },
)

const router = useRouter()
const { locationEnumLabel } = useJobFilters()

const companyRef = computed(() => props.company)
const formattedCompanyName = computed(() => formatCompanyName(props.company?.name))

const hasCompanyDescription = computed(() =>
  hasRichTextContent(props.company.description),
)
const hasCompanyOverview = computed(() => !!props.company.overview?.trim())
const hasCompanyInsight = computed(() => !!props.company.insight?.trim())

const companySizeLabel = computed(() =>
  getCompanySizeLabel(props.company.companySize),
)

const {
  logoFallback,
  heroMetaLocation,
  galleryModalImages,
  galleryDisplayImages,
  videoPosterUrl,
  videoEmbedUrl,
  videoOpen,
  galleryModalOpen,
  galleryIndex,
  getOrganizationTypeLabel,
  openGallery,
  closeGallery,
  galleryPrev,
  galleryNext,
  openVideo,
} = useCompanyDetailView(companyRef)

const companyJobsCount = computed(() => props.company.jobs?.length ?? 0)

const JOBS_PER_PAGE = 4
const currentJobsPage = ref(1)

const totalJobsPages = computed(() => {
  const total = props.company.jobs?.length ?? 0
  return Math.ceil(total / JOBS_PER_PAGE)
})

const paginatedJobs = computed(() => {
  if (!props.company.jobs) return []
  const start = (currentJobsPage.value - 1) * JOBS_PER_PAGE
  return props.company.jobs.slice(start, start + JOBS_PER_PAGE)
})

watch(
  () => props.company.id,
  () => {
    currentJobsPage.value = 1
  },
)

const companyWebsiteUrl = computed(() => {
  const w = props.company.website?.trim()
  if (!w) return ''
  return w.startsWith('http://') || w.startsWith('https://') ? w : `https://${w}`
})

const companyOverviewItems = computed(() => {
  const items: { label: string; value: string }[] = []

  if (heroMetaLocation.value) {
    items.push({ label: 'Địa điểm', value: heroMetaLocation.value })
  }

  if (props.company.organizationType) {
    items.push({
      label: 'Chuyên về',
      value: String(getOrganizationTypeLabel(props.company.organizationType)),
    })
  }

  if (props.company.foundedYear) {
    items.push({ label: 'Thành lập', value: String(props.company.foundedYear) })
  }

  if (companySizeLabel.value) {
    items.push({ label: 'Quy mô', value: companySizeLabel.value })
  }

  if (props.company.mst) {
    items.push({ label: 'Mã số thuế', value: props.company.mst })
  }

  return items
})

const isCopied = ref(false)
const copyShareLink = async () => {
  try {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href)
      isCopied.value = true
      useNotify({ message: 'Đã sao chép liên kết nhà tuyển dụng!', type: 'success' })
      setTimeout(() => {
        isCopied.value = false
      }, 3000)
    }
  } catch {
    // ignore
  }
}

const scrollToJobs = () => {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('hiring-jobs-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function getLocationLabel(locationValue: string): string {
  if (locationValue === '0') return 'Toàn Quốc'
  return (
    (locationEnumLabel as Record<string, string>)?.[locationValue] ??
    (locationEnumLabel as Record<number, string>)?.[Number(locationValue)] ??
    locationValue
  )
}

function getFullLocationText(job: CompanyJobSummary): string {
  if (job.location == null || job.location === '') return ''
  return String(job.location)
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((loc) => getLocationLabel(loc))
    .join(', ')
}

function timeAgo(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${Math.max(diffMins, 1)} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Hôm qua'
  return `${diffDays} ngày trước`
}
</script>
