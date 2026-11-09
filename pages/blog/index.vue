<template>
  <div class="blog-directory-page min-h-screen">
    <!-- Top Hero Section (White background - VLDL Unified Style) -->
    <section class="blog-directory-hero">
      <div class="container blog-directory-shell">
        <div class="blog-directory-heading">
          <h1 class="blog-directory-title">Blog & Cẩm nang nghề giáo</h1>
          <p class="blog-directory-subtitle">Khám phá những bài viết hữu ích về phương pháp giảng dạy, kỹ năng sư phạm và cơ hội nghề nghiệp.</p>
        </div>

        <form class="blog-directory-search-card" @submit.prevent="applySearch">
          <div class="blog-search-input-wrap">
            <span class="blog-search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="Nhập tiêu đề bài viết, chủ đề hoặc từ khóa..."
            />
          </div>
          <button type="submit" class="blog-search-btn">
            Tìm kiếm
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="blog-directory-content">
      <div class="container">
        <!-- Category Filter Pills (if categories exist) -->
        <div v-if="!loading && blogBadges.length" class="blog-directory-filter-row">
          <div class="blog-directory-pills">
            <button
              type="button"
              class="blog-directory-pill"
              :class="{ 'is-active': selectedBadges.size === 0 }"
              @click="selectedBadges.clear(); currentPage = 1"
            >
              Tất cả
            </button>
            <button
              v-for="b in blogBadges"
              :key="b"
              type="button"
              class="blog-directory-pill"
              :class="{ 'is-active': selectedBadges.has(b) }"
              @click="toggleBadge(b)"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <!-- 1. Skeleton Loading -->
        <div v-if="loading" class="blog-directory-main">
          <div class="blog-directory-main__list">
            <div
              v-for="i in 3"
              :key="i"
              class="blog-directory-skeleton-card"
            >
              <USkeleton class="h-40 w-full rounded-xl" />
              <div class="flex flex-col justify-center gap-3">
                <div class="flex items-center gap-2">
                  <USkeleton class="h-6 w-20 rounded-full" />
                  <USkeleton class="h-4 w-24" />
                </div>
                <USkeleton class="h-6 w-4/5 rounded" />
                <USkeleton class="h-4 w-full rounded" />
                <USkeleton class="h-4 w-2/3 rounded" />
              </div>
            </div>
          </div>

          <aside class="blog-directory-main__sidebar">
            <div class="blog-sidebar-card">
              <USkeleton class="h-5 w-28 rounded-full mb-3" />
              <USkeleton class="h-6 w-40 rounded mb-2" />
              <USkeleton class="h-4 w-full rounded mb-4" />
              <USkeleton class="h-10 w-full rounded-xl" />
            </div>
          </aside>
        </div>

        <!-- 2. When Blogs Found -->
        <div v-else-if="filteredBlogs.length > 0" class="blog-directory-main">
          <!-- Left: Blog List -->
          <div class="blog-directory-main__list">
            <NuxtLink
              v-for="blog in paginatedBlogs"
              :key="blog.id"
              :to="`/blog/${blog.id}`"
              class="blog-directory-card-link"
            >
              <article class="blog-directory-card">
                <div class="blog-directory-card__media">
                  <img
                    v-if="blog.image"
                    :src="blog.image"
                    :alt="blog.title"
                    loading="lazy"
                  />
                  <div v-else class="blog-directory-card__placeholder">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                </div>

                <div class="blog-directory-card__body">
                  <div class="blog-directory-card__meta">
                    <span class="blog-category-badge">{{ blog.category || 'Blog' }}</span>
                    <span class="blog-card-date">{{ formatDate(blog.createdAt) }}</span>
                  </div>

                  <h3 class="blog-directory-card__title">
                    {{ blog.title }}
                  </h3>

                  <p class="blog-directory-card__desc">
                    {{ blog.description }}
                  </p>

                  <span class="blog-directory-card__more">
                    Đọc tiếp
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </article>
            </NuxtLink>

            <!-- Centered Pagination -->
            <div v-if="totalPages > 1" class="blog-directory-pagination">
              <div class="blog-directory-pagination__list">
                <button
                  type="button"
                  class="blog-directory-pagination__btn"
                  :disabled="currentPage <= 1"
                  aria-label="Trang trước"
                  @click="goToPage(currentPage - 1)"
                >
                  ‹
                </button>

                <button
                  v-for="p in visiblePages"
                  :key="p"
                  type="button"
                  class="blog-directory-pagination__btn"
                  :class="{ 'is-active': p === currentPage }"
                  @click="goToPage(p)"
                >
                  {{ p }}
                </button>

                <button
                  type="button"
                  class="blog-directory-pagination__btn"
                  :disabled="currentPage >= totalPages"
                  aria-label="Trang sau"
                  @click="goToPage(currentPage + 1)"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Sidebar -->
          <aside class="blog-directory-main__sidebar">
            <div class="blog-sidebar-card">
              <span class="blog-sidebar-badge">Dành cho giáo viên</span>
              <h3>Tìm việc làm giáo dục</h3>
              <p>Hàng ngàn cơ hội việc làm tại các trường học, trung tâm uy tín trên toàn quốc.</p>
              <NuxtLink to="/jobs/search" class="blog-sidebar-cta-btn">
                Xem việc làm mới
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </NuxtLink>
            </div>

            <div class="blog-sidebar-card">
              <span class="blog-sidebar-badge blog-sidebar-badge-employer">Dành cho nhà tuyển dụng</span>
              <h3>Đăng tin tuyển dụng</h3>
              <p>Tiếp cận nhanh chóng với mạng lưới hàng ngàn giáo viên tài năng, phù hợp.</p>
              <NuxtLink to="/jobs/upload" class="blog-sidebar-outline-btn">
                Đăng tin miễn phí
              </NuxtLink>
            </div>
          </aside>
        </div>

        <!-- 3. Empty State (Clean Card Matching New Theme) -->
        <div v-else class="blog-empty-state-wrapper">
          <div class="blog-empty-state-card">
            <div class="blog-empty-icon-box" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="14" y2="10" />
              </svg>
            </div>

            <h2 class="blog-empty-title">Chưa có bài viết nào</h2>
            <p class="blog-empty-desc">
              Chuyên mục Blog đang được ban biên tập cập nhật những bài viết và cẩm nang giáo dục mới nhất. Bạn hãy quay lại sau hoặc khám phá các cơ hội việc làm hấp dẫn nhé!
            </p>

            <div class="blog-empty-actions">
              <NuxtLink to="/jobs/search" class="blog-empty-primary-btn">
                Khám phá việc làm
              </NuxtLink>
              <NuxtLink to="/" class="blog-empty-secondary-btn">
                Quay lại trang chủ
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { BlogEntity } from '~/entities/blog'

const { $api } = useNuxtApp()

useHead({
  title: 'Blog & Cẩm nang nghề giáo - TuyenGiaoVien.vn',
})

const blogs = ref<BlogEntity[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const appliedKeyword = ref('')
const pageSize = 6
const currentPage = ref(1)
const selectedBadges = reactive(new Set<string>())

const applySearch = () => {
  appliedKeyword.value = searchKeyword.value.trim()
  currentPage.value = 1
}

const toggleBadge = (label: string) => {
  const key = String(label).trim()
  if (!key) return
  if (selectedBadges.has(key)) selectedBadges.delete(key)
  else selectedBadges.add(key)
  currentPage.value = 1
}

const filteredBlogs = computed(() => {
  const q = appliedKeyword.value.trim().toLowerCase()
  const hasBadgeFilter = selectedBadges.size > 0
  return blogs.value.filter((b) => {
    if (hasBadgeFilter) {
      const cat = String((b as any)?.category ?? '').trim()
      if (!cat || !selectedBadges.has(cat)) return false
    }
    if (!q) return true
    const hay = `${b.title ?? ''} ${b.description ?? ''} ${(b as any)?.category ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredBlogs.value.length / pageSize)),
)

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBlogs.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const t = totalPages.value
  const c = currentPage.value
  if (t <= 3) return Array.from({ length: t }, (_, i) => i + 1)
  if (c <= 2) return [1, 2, 3]
  if (c >= t - 1) return [t - 2, t - 1, t]
  return [c - 1, c, c + 1]
})

const goToPage = (p: number) => {
  const next = Math.min(Math.max(1, p), totalPages.value)
  currentPage.value = next
}

watch(
  () => filteredBlogs.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

const blogBadges = computed(() => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const b of blogs.value) {
    const label = (b as any)?.category
    if (!label) continue
    const key = String(label).trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
})

const formatDate = (date?: Date | string) => {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchBlogs() {
  loading.value = true
  try {
    const response = await $api.blog.getAllBlogs()
    if (Array.isArray(response)) {
      blogs.value = response.filter((b: BlogEntity) => b.status === 'published')
    } else if (response && typeof response === 'object' && 'data' in response) {
      blogs.value = ((response as any).data || []).filter((b: BlogEntity) => b.status === 'published')
    } else {
      blogs.value = []
    }
  } catch (e) {
    console.error('Failed to load blogs:', e)
    blogs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>
