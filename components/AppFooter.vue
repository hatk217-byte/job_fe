<template>
  <footer id="contact" class="site-footer">
    <div class="container">
      <!-- 1. Top Brand & Call To Action Banner -->
      <div class="footer-top-cta">
        <div class="footer-brand-info">
          <NuxtLink to="/" class="footer-wordmark" aria-label="Trang chủ">
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <span class="wordmark-main">TuyenGiaoVien</span>
            <span class="wordmark-dot">.vn</span>
            <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
          </NuxtLink>
          <h2 class="footer-brand-heading">
            Nền tảng tuyển dụng &amp; phát triển sự nghiệp giáo dục.
          </h2>
          <p class="footer-brand-desc">
            Tìm kiếm công việc giảng dạy phù hợp, kết nối trực tiếp cùng hơn 200+ trường học và trung tâm uy tín trên cả nước.
          </p>
        </div>

        <div class="footer-cta-actions">
          <NuxtLink to="/jobs/search" class="footer-btn-primary">
            <span>Tìm việc làm</span>
            <span class="btn-arrow" aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink to="/jobs/upload" class="footer-btn-outline">
            <span>Đăng tin miễn phí</span>
            <span class="btn-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 2. Main Navigation Link Columns (4 cols) -->
      <div class="footer-nav-grid">
        <div class="footer-col">
          <h3 class="footer-col-title">Dành cho ứng viên</h3>
          <ul class="footer-nav-list">
            <li><NuxtLink to="/jobs/search">Tìm việc làm giáo viên</NuxtLink></li>
            <li><NuxtLink :to="{ path: '/jobs/search', query: { postType: 'Hot' } }">Việc làm mới nhất</NuxtLink></li>
            <li><NuxtLink :to="{ path: '/jobs/search', query: { postType: 'Urgent' } }">Việc làm tuyển gấp</NuxtLink></li>
            <li><NuxtLink to="/companies">Danh sách trường học &amp; trung tâm</NuxtLink></li>
            <li><NuxtLink to="/blog">Cẩm nang &amp; bài viết</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col-title">Dành cho nhà trường</h3>
          <ul class="footer-nav-list">
            <li><NuxtLink to="/jobs/upload">Đăng tin tuyển dụng</NuxtLink></li>
            <li><NuxtLink to="/companies">Hồ sơ nhà tuyển dụng</NuxtLink></li>
            <li><NuxtLink to="/auth/register">Đăng ký tài khoản</NuxtLink></li>
            <li><NuxtLink to="/auth/login">Đăng nhập quản trị</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col-title">Về TuyenGiaoVien</h3>
          <ul class="footer-nav-list">
            <li><NuxtLink to="/contact">Liên hệ hợp tác</NuxtLink></li>
            <li><NuxtLink to="/policy#chinh-sach-quyen-rieng-tu">Chính sách quyền riêng tư</NuxtLink></li>
            <li><NuxtLink to="/policy#dieu-khoan-dieu-kien">Điều khoản sử dụng</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col footer-col-contact">
          <h3 class="footer-col-title">Hỗ trợ &amp; Liên hệ</h3>
          <div class="footer-contact-info">
            <a v-if="phoneNumber" :href="telHref" class="footer-contact-link">
              <span class="contact-label">Hotline:</span>
              <strong>{{ phoneNumber }}</strong>
            </a>
            <a v-if="email" :href="mailtoHref" class="footer-contact-link">
              <span class="contact-label">Email:</span>
              <strong>{{ email }}</strong>
            </a>
            <p class="footer-support-time">
              Giờ làm việc: 8:00 – 18:00 (Thứ 2 – Thứ 6)
            </p>
          </div>
        </div>
      </div>

      <!-- 3. Accordion Section: Popular Job Searches (Like Image 1, 2 & 3) -->
      <div class="footer-searches-section">
        <h3 class="footer-searches-heading">Tìm kiếm việc làm phổ biến</h3>

        <div class="footer-accordions">
          <!-- Item 1: Phổ biến (Default Open) -->
          <div class="accordion-item" :class="{ 'is-open': accordions.popular }">
            <button
              type="button"
              class="accordion-trigger"
              :aria-expanded="accordions.popular"
              @click="toggleAccordion('popular')"
            >
              <span>Tìm kiếm phổ biến</span>
              <span class="accordion-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div v-show="accordions.popular" class="accordion-body">
              <div class="search-links-grid">
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên tiếng Anh' } }">Giáo viên tiếng Anh</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Toán' } }">Giáo viên Toán</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Ngữ văn' } }">Giáo viên Ngữ văn</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Mầm non' } }">Giáo viên Mầm non</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiểu học' } }">Giáo viên Tiểu học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Trợ giảng tiếng Anh' } }">Trợ giảng tiếng Anh</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Trợ giảng Toán' } }">Trợ giảng Toán</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tin học' } }">Giáo viên Tin học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên STEM' } }">Giáo viên STEM/STEAM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Khoa học tự nhiên' } }">Giáo viên Khoa học tự nhiên</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Vật lý' } }">Giáo viên Vật lý</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Hoá học' } }">Giáo viên Hoá học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên tiếng Trung' } }">Giáo viên tiếng Trung</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên tiếng Nhật' } }">Giáo viên tiếng Nhật</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên tiếng Hàn' } }">Giáo viên tiếng Hàn</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Thể chất' } }">Giáo viên Thể chất</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Item 2: Theo môn học & vị trí -->
          <div class="accordion-item" :class="{ 'is-open': accordions.bySubject }">
            <button
              type="button"
              class="accordion-trigger"
              :aria-expanded="accordions.bySubject"
              @click="toggleAccordion('bySubject')"
            >
              <span>Việc làm theo môn học &amp; vị trí</span>
              <span class="accordion-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div v-show="accordions.bySubject" class="accordion-body">
              <div class="search-links-grid">
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Mầm non' } }">Việc làm Giáo viên mầm non</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiểu học' } }">Việc làm Giáo viên tiểu học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Ngữ văn' } }">Việc làm Giáo viên ngữ văn</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Toán' } }">Việc làm Giáo viên toán</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiếng Anh' } }">Việc làm Giáo viên tiếng Anh</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Vật lý' } }">Việc làm Giáo viên vật lý</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Hoá học' } }">Việc làm Giáo viên hoá học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Khoa học tự nhiên' } }">Việc làm Giáo viên khoa học tự nhiên</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Lịch sử' } }">Việc làm Giáo viên lịch sử</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Địa lí' } }">Việc làm Giáo viên địa lí</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tin học' } }">Việc làm Giáo viên tin học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Công nghệ' } }">Việc làm Giáo viên công nghệ</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Thể chất' } }">Việc làm Giáo viên thể chất</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Nghệ thuật' } }">Việc làm Giáo viên âm nhạc, mĩ thuật</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiếng Trung' } }">Việc làm Giáo viên tiếng Trung</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiếng Nhật' } }">Việc làm Giáo viên tiếng Nhật</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiếng Hàn' } }">Việc làm Giáo viên tiếng Hàn</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên Tiếng Pháp' } }">Việc làm Giáo viên tiếng Pháp</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Giáo viên STEM' } }">Việc làm Giáo viên STEM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Trợ giảng' } }">Việc làm Trợ giảng lớp học</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Item 3: Theo cấp học & hình thức làm việc -->
          <div class="accordion-item" :class="{ 'is-open': accordions.byPhase }">
            <button
              type="button"
              class="accordion-trigger"
              :aria-expanded="accordions.byPhase"
              @click="toggleAccordion('byPhase')"
            >
              <span>Việc làm theo cấp học &amp; hình thức làm việc</span>
              <span class="accordion-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div v-show="accordions.byPhase" class="accordion-body">
              <div class="search-links-grid">
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Mầm non' } }">Giáo viên Mầm non</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Tiểu học' } }">Giáo viên Trường Tiểu học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'THCS' } }">Giáo viên Trường THCS</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'THPT' } }">Giáo viên Trường THPT</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Cao đẳng' } }">Giảng viên Cao đẳng</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Đại học' } }">Giảng viên Đại học</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { typeOfEmployment: '2' } }">Việc làm Toàn thời gian</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { typeOfEmployment: '3' } }">Việc làm Bán thời gian</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { typeOfEmployment: '1' } }">Việc làm Thực tập sinh</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { typeOfEmployment: '4' } }">Việc làm Giáo viên Remote / Online</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Item 4: Theo tỉnh thành / khu vực -->
          <div class="accordion-item" :class="{ 'is-open': accordions.byLocation }">
            <button
              type="button"
              class="accordion-trigger"
              :aria-expanded="accordions.byLocation"
              @click="toggleAccordion('byLocation')"
            >
              <span>Việc làm giáo viên theo tỉnh thành</span>
              <span class="accordion-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div v-show="accordions.byLocation" class="accordion-body">
              <div class="search-links-grid">
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '12' } }">Việc làm giáo viên tại Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '29' } }">Việc làm giáo viên tại TP. Hồ Chí Minh</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '21' } }">Việc làm giáo viên tại Đà Nẵng</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '13' } }">Việc làm giáo viên tại Hải Phòng</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '33' } }">Việc làm giáo viên tại Cần Thơ</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '14' } }">Việc làm giáo viên tại Hưng Yên</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '27' } }">Việc làm giáo viên tại Đồng Nai</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '18' } }">Việc làm giáo viên tại Nghệ An</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '17' } }">Việc làm giáo viên tại Thanh Hóa</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '11' } }">Việc làm giáo viên tại Quảng Ninh</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '5' } }">Việc làm giáo viên tại Thái Nguyên</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { location: '20' } }">Việc làm giáo viên tại Huế</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Item 5: Môn học theo thành phố lớn -->
          <div class="accordion-item" :class="{ 'is-open': accordions.byRoleAndLocation }">
            <button
              type="button"
              class="accordion-trigger"
              :aria-expanded="accordions.byRoleAndLocation"
              @click="toggleAccordion('byRoleAndLocation')"
            >
              <span>Việc làm môn học tại các thành phố lớn</span>
              <span class="accordion-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div v-show="accordions.byRoleAndLocation" class="accordion-body">
              <div class="search-links-grid">
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Tiếng Anh', location: '12' } }">Giáo viên tiếng Anh Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Tiếng Anh', location: '29' } }">Giáo viên tiếng Anh TP.HCM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Toán', location: '12' } }">Giáo viên Toán Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Toán', location: '29' } }">Giáo viên Toán TP.HCM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Ngữ văn', location: '12' } }">Giáo viên Ngữ văn Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Ngữ văn', location: '29' } }">Giáo viên Ngữ văn TP.HCM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Mầm non', location: '12' } }">Giáo viên Mầm non Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Mầm non', location: '29' } }">Giáo viên Mầm non TP.HCM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Tiểu học', location: '12' } }">Giáo viên Tiểu học Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Tiểu học', location: '29' } }">Giáo viên Tiểu học TP.HCM</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Trợ giảng', location: '12' } }">Trợ giảng tiếng Anh Hà Nội</NuxtLink>
                <NuxtLink :to="{ path: '/jobs/search', query: { keyword: 'Trợ giảng', location: '29' } }">Trợ giảng tiếng Anh TP.HCM</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Footer Bottom Bar -->
      <div class="footer-bottom-bar">
        <p class="footer-copyright">
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          © {{ currentYear }} tuyengiaovien.vn. Toàn bộ bản quyền được bảo lưu.
          <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
        </p>

        <div class="footer-legal-links">
          <NuxtLink to="/policy#chinh-sach-quyen-rieng-tu">Chính sách bảo mật</NuxtLink>
          <NuxtLink to="/policy#dieu-khoan-dieu-kien">Điều khoản dịch vụ</NuxtLink>
          <NuxtLink to="/contact">Liên hệ hỗ trợ</NuxtLink>
          <NuxtLink to="/faq">Trợ giúp</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
const { email, phoneNumber, mailtoHref, telHref } = useAdminContactInfo()

const accordions = ref<Record<string, boolean>>({
  popular: true,
  bySubject: false,
  byPhase: false,
  byLocation: false,
  byRoleAndLocation: false,
})

const toggleAccordion = (key: string) => {
  accordions.value[key] = !accordions.value[key]
}
</script>
