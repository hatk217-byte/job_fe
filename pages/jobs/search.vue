<template>
  <div class="min-h-screen bg-[var(--bg)] jobs-directory-page">
    <section class="jobs-directory-hero">
      <div class="container jobs-directory-shell">
        <form
          class="search-card jobs-directory-search-card"
          @submit.prevent="performSearch"
        >
          <div class="search-row search-row-directory jobs-search-row">
            <div class="search-item search-item-directory jobs-search-item jobs-search-item-keyword">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <input
                v-model="searchParams.keyword"
                type="text"
                name="keyword"
                placeholder="Tên vị trí, trường học hoặc từ khóa..."
              >
            </div>

            <div class="search-item search-item-directory jobs-search-item jobs-search-item-select">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20M7 4V7M17 4V7M6 11H20V18H6V11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <div class="jobs-directory-vselect job-vselect w-full min-w-0">
                <v-select
                  v-model="categoryForSelect"
                  :options="categoryItemsSearchable"
                  :append-to-body="true"
                  multiple
                  searchable
                  class="w-full text-sm"
                  placeholder="Bộ môn"
                  label="label"
                  :clear-search-on-blur="() => true"
                  @open="onMultiSelectOpen"
                  @close="onMultiSelectClose"
                >
                  <template #selected-option-container="{ option, deselect }">
                    <span
                      v-if="String(categoryForSelect[0]?.value) === String(option.value)"
                      class="vs__selected"
                    >
                      <span class="vs__selected-label" :title="option.label">{{ option.label }}</span>
                      <button
                        type="button"
                        class="vs__deselect"
                        :title="`Bỏ chọn ${option.label}`"
                        @click.stop="deselect(option)"
                      >
                        ✕
                      </button>
                    </span>
                    <span
                      v-if="String(categoryForSelect[0]?.value) === String(option.value) && categoryForSelect.length > 1"
                      class="vs__selected-more-badge"
                      :title="categoryForSelect.slice(1).map((x: any) => x.label).join(', ')"
                    >
                      +{{ categoryForSelect.length - 1 }}
                    </span>
                  </template>
                </v-select>
              </div>
              <span class="arr">▾</span>
            </div>

            <div class="search-item search-item-directory jobs-search-item jobs-search-item-select">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C15.5 17.2 18 14.1 18 10.5C18 6.91015 15.3137 4 12 4C8.68629 4 6 6.91015 6 10.5C6 14.1 8.5 17.2 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <div class="jobs-directory-vselect job-vselect w-full min-w-0">
                <v-select
                  v-model="locationForSelect"
                  :options="locationItemsSearchable"
                  :append-to-body="true"
                  multiple
                  searchable
                  class="w-full text-sm"
                  placeholder="Tỉnh thành"
                  label="label"
                  :clear-search-on-blur="() => true"
                  @open="onMultiSelectOpen"
                  @close="onMultiSelectClose"
                >
                  <template #selected-option-container="{ option, deselect }">
                    <span
                      v-if="String(locationForSelect[0]?.value) === String(option.value)"
                      class="vs__selected"
                    >
                      <span class="vs__selected-label" :title="option.label">{{ option.label }}</span>
                      <button
                        type="button"
                        class="vs__deselect"
                        :title="`Bỏ chọn ${option.label}`"
                        @click.stop="deselect(option)"
                      >
                        ✕
                      </button>
                    </span>
                    <span
                      v-if="String(locationForSelect[0]?.value) === String(option.value) && locationForSelect.length > 1"
                      class="vs__selected-more-badge"
                      :title="locationForSelect.slice(1).map((x: any) => x.label).join(', ')"
                    >
                      +{{ locationForSelect.length - 1 }}
                    </span>
                  </template>
                </v-select>
              </div>
              <span class="arr">▾</span>
            </div>

            <button
              type="submit"
              class="primary-btn jobs-directory-submit"
              aria-label="Tìm việc làm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Main content -->
    <div class="container">
      <div class="jobs-directory-main">
        <div class="jobs-search-layout">
          <!-- Left: Filter Sidebar -->
          <aside class="jobs-filter-sidebar">
            <div v-if="hasActiveFilters" class="sidebar-clear-wrap">
              <button
                type="button"
                class="sidebar-clear-btn"
                @click="clearFilters"
              >
                <span>Xóa bộ lọc đã chọn</span>
                <span class="clear-icon" aria-hidden="true">✕</span>
              </button>
            </div>

            <!-- Group 1: Hình thức làm việc -->
            <div class="filter-group">
              <div class="filter-group-title">
                <span>Hình thức làm việc</span>
                <span v-if="selectedFilters.employmentType.length" class="text-xs font-semibold text-emerald-600">
                  ({{ selectedFilters.employmentType.length }})
                </span>
              </div>
              <div class="filter-group-list">
                <label
                  v-for="type in employmentTypeItems"
                  :key="type.value"
                  class="filter-option"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.employmentType.includes(type.value)"
                    @change="toggleFilter('employmentType', type.value)"
                  >
                  <span class="filter-label">{{ type.label }}</span>
                </label>
              </div>
            </div>

            <!-- Group 2: Kinh nghiệm -->
            <div class="filter-group">
              <div class="filter-group-title">
                <span>Kinh nghiệm</span>
                <span v-if="selectedFilters.experienceLevel.length" class="text-xs font-semibold text-emerald-600">
                  ({{ selectedFilters.experienceLevel.length }})
                </span>
              </div>
              <div class="filter-group-list">
                <label
                  v-for="level in experienceLevelItems"
                  :key="level.value"
                  class="filter-option"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.experienceLevel.includes(level.value)"
                    @change="toggleFilter('experienceLevel', level.value)"
                  >
                  <span class="filter-label">{{ level.label }}</span>
                </label>
              </div>
            </div>

            <!-- Group 3: Cấp học -->
            <div class="filter-group">
              <div class="filter-group-title">
                <span>Cấp học</span>
                <span v-if="selectedFilters.grade.length" class="text-xs font-semibold text-emerald-600">
                  ({{ selectedFilters.grade.length }})
                </span>
              </div>
              <div class="filter-group-list">
                <label
                  v-for="g in gradeItems"
                  :key="g.value"
                  class="filter-option"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.grade.includes(g.value)"
                    @change="toggleFilter('grade', g.value)"
                  >
                  <span class="filter-label">{{ g.label }}</span>
                </label>
              </div>
            </div>
          </aside>

          <!-- Right: Job Results -->
          <main class="jobs-results-content">
            <!-- Loading state -->
            <div v-if="loading" class="space-y-4">
              <USkeleton v-for="i in 5" :key="i" class="h-32 w-full" />
            </div>

            <div v-else-if="filteredJobs.length > 0" class="jobs-directory-results space-y-4">
              <p class="job-results-count">
                <span class="job-results-count__number">{{ filteredJobs.length }}</span>
                <span class="job-results-count__label">việc làm phù hợp</span>
              </p>

              <div class="job-list-urgent">
                <article
                  v-for="job in paginatedJobs"
                  :key="job.id"
                  class="job-row-urgent is-visible"
                  role="link"
                  tabindex="0"
                  @click="viewJob(job)"
                  @keydown.enter.prevent="viewJob(job)"
                >
                  <div
                    class="job-logo"
                    :class="{ 'logo-has-image': !!job.companyLogo }"
                  >
                    <img
                      v-if="job.companyLogo"
                      :src="job.companyLogo"
                      :alt="`${job.companyName} logo`"
                      loading="lazy"
                    >
                    <template v-else>
                      {{ (job.companyName || 'CT').slice(0, 2).toUpperCase() }}
                    </template>
                  </div>

                  <div class="job-row-content">
                    <NuxtLink
                      :to="`/jobs/${job.id}`"
                      class="job-row-title-link"
                      @click.stop
                    >
                      <h3 class="job-row-title">{{ job.title }}</h3>
                    </NuxtLink>

                    <div class="job-row-company">
                      <NuxtLink
                        v-if="job.companyId"
                        :to="`/companies/${job.companyId}`"
                        class="jobs-employer-link"
                        @click.stop
                      >
                        {{ job.companyName }}
                      </NuxtLink>
                      <span v-else>{{ job.companyName }}</span>
                    </div>

                    <div class="job-row-meta">
                      <span v-if="getFullLocationText(job)" class="meta-item">
                        {{ truncateText(getFullLocationText(job), 32) }}
                      </span>
                      <span v-if="getEmploymentTypeText(job)" class="meta-item">
                        {{ getEmploymentTypeText(job) }}
                      </span>
                      <span v-if="getExperienceText(job) && getExperienceText(job) !== 'Không yêu cầu'" class="meta-item">
                        {{ getExperienceText(job) }}
                      </span>
                      <span v-if="job.createdAt" class="meta-item meta-item-date">
                        {{ timeAgo(job.createdAt) }}
                      </span>
                    </div>

                    <div class="job-row-salary">
                      {{ formatSalaryRange(job) }}
                    </div>
                  </div>

                  <div class="job-row-side">
                    <span v-if="shouldShowUrgentTag(job)" class="job-fire-icon" title="Tuyển gấp" aria-label="Tuyển gấp">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                        <path fill="#ea580c" d="M12 23c-4.97 0-9-4.03-9-9 0-4.92 3.84-9.36 6.89-12.06.4-.35.99-.21 1.2.29.98 2.27 2.7 4.09 3.91 5.37.28.29.74.22.92-.14.73-1.42 1.61-3.66 1.15-5.96-.08-.41.28-.78.7-.72 4.16.59 7.23 4.8 7.23 8.22 0 4.97-4.03 9-9 9z" />
                        <path fill="#f59e0b" d="M11.5 17.5c1.93 0 3.5-1.57 3.5-3.5 0-1.88-1.55-3.41-3.23-4.88-.23-.2-.58-.09-.67.19-.51 1.63-1.6 3.19-1.6 4.69 0 1.93 1.57 3.5 2 3.5z" />
                      </svg>
                    </span>
                    <span v-else />

                    <NuxtLink
                      :to="`/jobs/${job.id}`"
                      class="job-row-apply"
                      @click.stop
                    >
                      <span>Ứng tuyển</span>
                      <span class="apply-arrow" aria-hidden="true">→</span>
                    </NuxtLink>
                  </div>
                </article>
              </div>

              <!-- Pagination -->
              <nav
                v-if="totalPages > 1"
                class="jobs-search-pagination"
                aria-label="Phân trang việc làm"
              >
                <button
                  type="button"
                  class="pagination-nav-btn"
                  :disabled="currentPage <= 1"
                  aria-label="Trang trước"
                  @click="goToPage(currentPage - 1)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div class="pagination-pages">
                  <template v-for="(item, idx) in paginationItems" :key="`${item}-${idx}`">
                    <span v-if="item === 'ellipsis'" class="pagination-ellipsis" aria-hidden="true">…</span>
                    <button
                      v-else
                      type="button"
                      class="pagination-page-btn"
                      :class="{ 'is-active': item === currentPage }"
                      :aria-label="`Trang ${item}`"
                      :aria-current="item === currentPage ? 'page' : undefined"
                      @click="goToPage(item)"
                    >
                      {{ item }}
                    </button>
                  </template>
                </div>

                <button
                  type="button"
                  class="pagination-nav-btn"
                  :disabled="currentPage >= totalPages"
                  aria-label="Trang tiếp theo"
                  @click="goToPage(currentPage + 1)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </nav>
            </div>

            <!-- Empty state -->
            <div v-else class="jobs-empty-state">
              <div class="empty-icon-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 class="empty-title">
                {{ $t('search.noResults') }}
              </h3>
              <p class="empty-desc">
                {{ $t('search.noResultsDescription') }}
              </p>
              <button
                type="button"
                class="empty-reset-btn"
                @click="clearSearch"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Xóa bộ lọc & tìm kiếm lại</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>

    <JobsJobApplicationDrawer
      v-model:open="applyDrawerOpen"
      :job="applyingJob"
    />
    <!-- Footer is rendered by default layout -->
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { JobMapper } from '~/mapper/job'
import { formatSalaryRange } from '~/utils/formatSalary'
import { hasRichTextContent } from '~/utils/rich-text'

interface SearchParams {
  keyword: string
  category: string[]
  location: string[]
}

interface SelectedFilters {
  employmentType: string[]
  experienceLevel: string[]
  grade: string[]
}

const vSelectOpenCount = ref(0)

const preventScrollOutsideVSelect = (e: Event) => {
  const target = e.target as HTMLElement | null
  if (target?.closest?.('.vs__dropdown-menu')) return
  e.preventDefault()
}

const setVSelectScrollLock = (locked: boolean) => {
  if (!import.meta.client) return
  document.body.classList.toggle('vselect-scroll-lock', locked)
  if (locked) {
    window.addEventListener('wheel', preventScrollOutsideVSelect, { passive: false })
    window.addEventListener('touchmove', preventScrollOutsideVSelect, { passive: false })
  } else {
    window.removeEventListener('wheel', preventScrollOutsideVSelect as EventListener)
    window.removeEventListener('touchmove', preventScrollOutsideVSelect as EventListener)
  }
}

const onMultiSelectOpen = () => {
  vSelectOpenCount.value += 1
  if (vSelectOpenCount.value === 1) setVSelectScrollLock(true)
}

const onMultiSelectClose = () => {
  vSelectOpenCount.value = Math.max(0, vSelectOpenCount.value - 1)
  if (vSelectOpenCount.value === 0) setVSelectScrollLock(false)
}

// Enum
const {
  categoryItemsSearchable,
  employmentTypeItems,
  experienceLevelItems,
  gradeItems,
  locationItemsSearchable,
  locationEnumLabel,
  categoryEnumLabel,
  employmentTypesEnumLabel,
  experienceLevelsEnumLabel,
  postTypeOptions,
  jobBenefits,
  requiredQualificationLabel,
} = useJobFilters()

const URGENT_TAG_LABEL = 'Tuyển gấp'

const getJobPostTypeLabel = (postType?: string | null): string => {
  const raw = (postType ?? '').trim()
  if (!raw) return ''
  if (raw === URGENT_TAG_LABEL) return URGENT_TAG_LABEL

  const opt = postTypeOptions.find(
    (p) => p.value.toLowerCase() === raw.toLowerCase(),
  )

  return opt?.label ?? ''
}

const shouldShowUrgentTag = (job: JobModel) =>
  getJobPostTypeLabel(job.postType) === URGENT_TAG_LABEL

const getEmploymentTypeText = (job: JobModel) => {
  const key = job.typeOfEmployment
  const label =
    (employmentTypesEnumLabel as Record<string, string>)?.[String(key)] ??
    (employmentTypesEnumLabel as Record<number, string>)?.[Number(key)]

  return label || String(key ?? '').trim()
}

const getExperienceText = (job: JobModel) => {
  const v = (job.experienceLevel ?? '').toString().trim()
  if (!v) return ''
  return (
    (experienceLevelsEnumLabel as any)?.[v as any] ??
    (experienceLevelsEnumLabel as any)?.[Number(v) as any] ??
    v
  )
}

useHead({
  title: 'Tìm việc',
})

// Route
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { ensureLoaded, hasAppliedToJob, canApplyToJobs } = useAppliedJobs()

// Reactive data
const loading = ref(false)
const jobs = ref<JobModel[]>([])
const applyDrawerOpen = ref(false)
const applyingJob = ref<JobModel | null>(null)

const parseIdList = (raw: unknown): string[] => {
  if (raw == null) return []
  const str = String(raw).trim()

  if (!str) return []
  return str
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

const mapLabels = (
  labelMap: Record<string, string>,
  raw: unknown,
): string[] => {
  const parts = parseIdList(raw)
  if (!parts.length) return []

  const allNumericLike = parts.every((p) => /^\d+$/.test(p))
  if (!allNumericLike) return parts

  return parts
    .map((p) => labelMap[p] ?? labelMap[String(Number(p))] ?? '')
    .filter(Boolean)
}

const benefitsList = (job: JobModel | null): string[] =>
  mapLabels(jobBenefits as any, job?.benefits)

const requiredQualificationList = (job: JobModel | null): string[] =>
  mapLabels(requiredQualificationLabel as any, job?.requiredQualification)

// Search parameters
const searchParams = ref<SearchParams>({
  keyword: '',
  category: [],
  location: [],
})

const categoryForSelect = computed({
  get: () =>
    searchParams.value.category
      .map((v) =>
        categoryItemsSearchable.value.find(
          (o) => String(o.value) === String(v),
        ),
      )
      .filter(Boolean) as { value: string; label: string }[],
  set: (val: { value: string; label: string }[]) => {
    searchParams.value.category = (val || [])
      .map((o) => o?.value ?? '')
      .filter(Boolean)
  },
})

const locationForSelect = computed({
  get: () =>
    searchParams.value.location
      .map((v) =>
        locationItemsSearchable.value.find(
          (o) => String(o.value) === String(v),
        ),
      )
      .filter(Boolean) as { value: string; label: string }[],
  set: (val: { value: string; label: string }[]) => {
    searchParams.value.location = (val || [])
      .map((o) => o?.value ?? '')
      .filter(Boolean)
  },
})

// Selected filters
const selectedFilters = ref<SelectedFilters>({
  employmentType: [],
  experienceLevel: [],
  grade: [],
})

const hasActiveFilters = computed(
  () =>
    selectedFilters.value.employmentType.length > 0 ||
    selectedFilters.value.experienceLevel.length > 0 ||
    selectedFilters.value.grade.length > 0,
)

// Computed
const filteredJobs = computed(() => {
  // Sort order priority: Urgent > Hot > Basic
  const postTypePriority: Record<string, number> = {
    Urgent: 1,
    Hot: 2,
    Basic: 3,
  }

  return jobs.value
    .filter((job) => {
      // Employment type filter
      if (
        selectedFilters.value.employmentType.length > 0 &&
        !selectedFilters.value.employmentType.includes(
          String(job.typeOfEmployment),
        )
      ) {
        return false
      }

      // Experience level filter
      if (
        selectedFilters.value.experienceLevel.length > 0 &&
        !selectedFilters.value.experienceLevel.includes(
          String(job.experienceLevel),
        )
      ) {
        return false
      }

      // Grade filter
      if (
        selectedFilters.value.grade.length > 0 &&
        !selectedFilters.value.grade.includes(String((job as any).grade ?? ''))
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const priorityA = postTypePriority[a.postType || 'Basic'] || 3
      const priorityB = postTypePriority[b.postType || 'Basic'] || 3
      if (priorityA !== priorityB) return priorityA - priorityB
      // Secondary sort by createdAt DESC
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
})

// Pagination
const pageSize = ref(10)
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredJobs.value.length / pageSize.value))
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredJobs.value.slice(start, start + pageSize.value)
})

type PaginationItem = number | 'ellipsis'

const paginationItems = computed((): PaginationItem[] => {
  const total = totalPages.value
  const current = currentPage.value
  const items: PaginationItem[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      items.push(i)
    }
    return items
  }

  items.push(1)

  if (current > 3) {
    items.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (current < total - 2) {
    items.push('ellipsis')
  }

  items.push(total)
  return items
})

const goToPage = (p: number) => {
  const next = Math.min(Math.max(1, p), totalPages.value)
  currentPage.value = next
  if (import.meta.client) {
    const listTop = document.querySelector('.jobs-results-content') as HTMLElement | null
    if (listTop) {
      const topOffset = listTop.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

watch(
  () => filteredJobs.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
    }
  },
)

// Methods
const selectJob = (job: JobModel) => {
  viewJob(job)
}

const performSearch = async () => {
  loading.value = true
  currentPage.value = 1

  try {
    // Build search parameters
    const apiParams: Record<string, any> = {}

    if (searchParams.value.keyword?.trim()) {
      apiParams.keyword = searchParams.value.keyword.trim()
    }

    if (searchParams.value.category.length > 0) {
      apiParams.category = searchParams.value.category
    }

    if (searchParams.value.location.length > 0) {
      apiParams.location = searchParams.value.location
    }

    // Add filters
    if (selectedFilters.value.employmentType.length > 0) {
      apiParams.typeOfEmployment = selectedFilters.value.employmentType
    }

    if (selectedFilters.value.experienceLevel.length > 0) {
      apiParams.experienceLevel = selectedFilters.value.experienceLevel
    }

    if (selectedFilters.value.grade.length > 0) {
      apiParams.grade = selectedFilters.value.grade
    }

    // Call API
    const response = await $api.job.searchJob(apiParams)

    console.log(response)

    if (response && Array.isArray(response)) {
      jobs.value = response.map((job) => JobMapper.toModel(job))
    } else {
      jobs.value = []
    }
  } catch (error: any) {
    console.error('Search failed:', error)
    useNotify({
      message: error.message,
    })
    jobs.value = []
  } finally {
    loading.value = false
  }
}

const toggleFilter = (filterType: keyof SelectedFilters, value: string) => {
  const filters = selectedFilters.value[filterType]
  const index = filters.indexOf(value)

  if (index > -1) {
    filters.splice(index, 1)
  } else {
    filters.push(value)
  }

  // Auto search when filters change
  performSearch()
}

const clearFilters = () => {
  selectedFilters.value = {
    employmentType: [],
    experienceLevel: [],
    grade: [],
  }
  performSearch()
}

const clearSearch = async () => {
  searchParams.value = {
    keyword: '',
    category: [],
    location: [],
  }
  selectedFilters.value = {
    employmentType: [],
    experienceLevel: [],
    grade: [],
  }
  await router.replace({ path: route.path, query: {} })
  await performSearch()
}

// Function to get location label
const getLocationLabel = (locationValue: string): string => {
  if (locationValue === '0') return 'Toàn Quốc'

  return (locationEnumLabel as any)?.[locationValue] ?? (locationEnumLabel as any)?.[Number(locationValue)] ?? locationValue
}

// Function to get all location labels for a job
const getAllLocationLabels = (job: JobModel): string[] => {
  if (!job.location) return []
  const locationStr = String(job.location)
  const locations = locationStr.split(',').map(l => l.trim()).filter(l => l)

  return locations.map(loc => getLocationLabel(loc))
}

// Function to get full location text for a job
const getFullLocationText = (job: JobModel): string => {
  const labels = getAllLocationLabels(job)

  return labels.join(', ')
}

// Function to truncate text
const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + '...'
}

// Function to get display category with priority for searched category
const getDisplayCategory = (jobCategory: string | null | undefined): string => {
  if (!jobCategory) return ''

  // Split category string into array
  const categories = jobCategory.split(',').map((cat) => cat.trim()).filter((cat) => cat !== '')

  if (categories.length === 0) return jobCategory

  const searchedCategories = searchParams.value.category
  const hasSearchedCategory = searchedCategories.length > 0

  if (hasSearchedCategory) {
    const foundCategory = categories.find((cat) =>
      searchedCategories.includes(cat),
    )
    if (foundCategory) {
      // If found, display the searched category
      return categoryEnumLabel?.[foundCategory as unknown as number] ?? foundCategory
    }
  }

  // If no searched category or not found, display the first category
  const firstCategory = categories[0]
  return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || jobCategory)
}

const viewJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/${job.id}`)
}

const openApplyDrawer = (job: JobModel) => {
  if (!canApplyToJobs.value || hasAppliedToJob(job.id)) return

  applyingJob.value = job
  applyDrawerOpen.value = true
}

const getExperienceColor = (level: string) => {
  switch (level) {
    case '1':
      return 'success'

    case '2':
      return 'primary'

    case '3':
      return 'secondary'

    case '4':
      return 'error'

    default:
      return 'neutral'
  }
}

const getJobLogoLetters = (job: JobModel) =>
  (job.companyName || job.title || 'TV')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

const timeAgo = (d: Date | string) => {
  const date = d instanceof Date ? d : new Date(d)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${Math.max(diffMins, 1)} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

// Initialize search from route query
onMounted(async () => {
  await ensureLoaded()
  const query = route.query

  if (query.keyword) searchParams.value.keyword = query.keyword as string

  const parseQueryStringArray = (raw: unknown): string[] => {
    if (raw == null) return []
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
    const str = String(raw).trim()
    if (!str) return []
    return str.split(/[,\n]/g).map((s) => s.trim()).filter(Boolean)
  }

  const categoryIds = parseQueryStringArray(query.category).filter((id) =>
    categoryItemsSearchable.value.some((item) => item.value === id),
  )
  if (categoryIds.length) searchParams.value.category = categoryIds

  const locationIds = parseQueryStringArray(query.location).filter((id) =>
    locationItemsSearchable.value.some((item) => item.value === id),
  )
  if (locationIds.length) searchParams.value.location = locationIds

  performSearch()
})

onUnmounted(() => {
  setVSelectScrollLock(false)
  vSelectOpenCount.value = 0
})
</script>

