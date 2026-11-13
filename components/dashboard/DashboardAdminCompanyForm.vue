<template>
  <form class="employer-company-form employer-admin-company-drawer-form" @submit.prevent="onSubmit">
    <label class="employer-field employer-field-full">
      <span>
        MST
        <span class="employer-required-star">{{ $t('common.requiredMark') }}</span>
      </span>
      <div class="employer-admin-company-mst-row">
        <UInput
          v-model.trim="form.mst"
          class="w-full min-w-0 flex-1"
          placeholder="Mã số thuế"
          :disabled="mstChecking || isEditMode"
          @input="onMstInput"
          @keydown.enter.prevent="validateMst"
        />
        <UButton
          v-if="!isEditMode"
          color="primary"
          class="employer-admin-company-mst-btn shrink-0"
          :loading="mstChecking"
          :disabled="!form.mst?.trim() || mstChecking"
          @click="validateMst"
        >
          {{ isMstVerified ? 'Kiểm tra lại' : 'Kiểm tra' }}
        </UButton>
      </div>
      <p v-if="mstChecking" class="employer-field-hint">Đang kiểm tra MST...</p>
      <p v-if="errors.mst" class="employer-field-error">{{ errors.mst }}</p>
      <p v-if="mstError && !errors.mst" class="employer-field-error">{{ mstError }}</p>
      <p v-if="isMstVerified && !mstError" class="employer-field-success">✓ MST đã được xác thực</p>
    </label>

    <label class="employer-field employer-field-full">
      <span>
        {{ $t('company.name') }}
        <span class="employer-required-star">{{ $t('common.requiredMark') }}</span>
      </span>
      <UInput
        v-model.trim="form.name"
        class="w-full"
        :placeholder="$t('company.form.placeholderName')"
        :disabled="isNameAutoFilled || (!isMstVerified && !isEditMode)"
        @input="errors.name = ''"
      />
      <p v-if="isNameAutoFilled" class="employer-field-hint">Tên công ty được tự động điền từ MST.</p>
      <p v-if="errors.name" class="employer-field-error">{{ errors.name }}</p>
    </label>

    <label class="employer-field employer-field-full">
      <span>{{ $t('company.form.insightLabel') }}</span>
      <UTextarea
        v-model.trim="form.insight"
        :rows="2"
        autoresize
        class="w-full"
        :placeholder="$t('company.form.placeholderInsight')"
        :disabled="(!isMstVerified && !isEditMode)"
      />
    </label>

    <label class="employer-field employer-field-full">
      <span>{{ $t('company.form.overviewLabel') }}</span>
      <UTextarea
        v-model.trim="form.overview"
        :rows="3"
        autoresize
        class="w-full"
        :placeholder="$t('company.form.overviewPlaceholder')"
        :disabled="(!isMstVerified && !isEditMode)"
      />
    </label>

    <label class="employer-field employer-field-full employer-field-editor">
      <span>{{ $t('company.form.descLabel') }}</span>
      <div class="employer-editor rich-text-output">
        <RichTextEditor
          :model-value="form.description || undefined"
          class="w-full rich-text-content"
          :placeholder="$t('company.form.descPlaceholder')"
          :disabled="!isMstVerified && !isEditMode"
          @update:model-value="(val) => (form.description = val || null)"
        />
      </div>
    </label>

    <label class="employer-field employer-field-full employer-field-editor">
      <span>
        {{ $t('job.uploadJob.detailAddressLabel') }}
        <span class="employer-required-star">{{ $t('common.requiredMark') }}</span>
      </span>
      <div class="employer-editor rich-text-output">
        <RichTextEditor
          v-model="form.address"
          class="w-full rich-text-content"
          :placeholder="$t('company.form.placeholderAddress')"
          :disabled="!isMstVerified && !isEditMode"
          @update:model-value="errors.address = ''"
        />
      </div>
      <p v-if="errors.address" class="employer-field-error">{{ errors.address }}</p>
    </label>

    <label class="employer-field employer-field-full">
      <span>Địa chỉ thuế</span>
      <UInput
        v-model.trim="form.taxAddress"
        class="w-full"
        placeholder="Địa chỉ thuế"
        :disabled="(!isMstVerified && !isEditMode)"
      />
    </label>

    <div class="employer-grid employer-grid-two">
      <label class="employer-field">
        <span>
          {{ $t('company.industry') }}
          <span class="employer-required-star">{{ $t('common.requiredMark') }}</span>
        </span>
        <USelectMenu
          :items="organizationTypeItemsSearchable"
          :model-value="form.organizationType?.toString() || undefined"
          value-key="value"
          class="w-full employer-org-type-select employer-field-control"
          :class="{
            'employer-field-select--placeholder': !form.organizationType,
            'employer-field-select--error': !!errors.organizationType,
          }"
          :ui="orgTypeSelectUi"
          :content="{ side: 'bottom' }"
          :placeholder="$t('company.industry')"
          :search-input="{ placeholder: 'Tìm loại hình...', variant: 'none' }"
          :disabled="(!isMstVerified && !isEditMode)"
          @update:model-value="(v) => { form.organizationType = Number(v ?? 0); errors.organizationType = '' }"
        />
        <p v-if="errors.organizationType" class="employer-field-error">{{ errors.organizationType }}</p>
      </label>

      <label class="employer-field">
        <span>{{ $t('company.founded') }}</span>
        <UInput
          v-model.number="form.foundedYear"
          type="number"
          min="1800"
          max="2100"
          class="w-full"
          :placeholder="$t('company.form.placeholderFounded') as string"
          :disabled="(!isMstVerified && !isEditMode)"
        />
        <p v-if="errors.foundedYear" class="employer-field-error">{{ errors.foundedYear }}</p>
      </label>
    </div>

    <label class="employer-field employer-field-full">
      <span>{{ $t('company.size') }}</span>
      <USelect
        id="company-size"
        :items="companySizeSelectItems"
        :model-value="form.companySize?.toString() ?? ''"
        class="w-full employer-field-select employer-field-control"
        :class="{
          'employer-field-select--placeholder': !form.companySize,
          'employer-field-select--error': !!errors.companySize,
        }"
        :ui="orgTypeSelectUi"
        :content="{ side: 'bottom' }"
        :placeholder="$t('company.form.placeholderCompanySize')"
        :disabled="(!isMstVerified && !isEditMode)"
        @update:model-value="
          (v) => {
            form.companySize = v ? Number(v) : null
            companySizeDirty = true
            errors.companySize = ''
          }
        "
      />
      <p v-if="errors.companySize" class="employer-field-error">{{ errors.companySize }}</p>
    </label>

    <label class="employer-field employer-field-full">
      <span>{{ $t('company.website') }}</span>
      <UInput
        v-model.trim="form.website"
        type="url"
        class="w-full"
        :placeholder="$t('company.form.placeholderWebsite')"
        :disabled="(!isMstVerified && !isEditMode)"
        @input="errors.website = ''"
      />
      <p v-if="errors.website" class="employer-field-error">{{ errors.website }}</p>
    </label>

    <div class="employer-grid employer-grid-two">
      <label class="employer-field">
        <span>{{ $t('company.social.facebook') }}</span>
        <UInput
          v-model.trim="form.facebookLink"
          class="w-full"
          :placeholder="$t('company.form.placeholderFacebook')"
          :disabled="(!isMstVerified && !isEditMode)"
        />
      </label>
      <label class="employer-field">
        <span>{{ $t('company.social.twitter') }}</span>
        <UInput
          v-model.trim="form.twitterLink"
          class="w-full"
          :placeholder="$t('company.form.placeholderTwitter')"
          :disabled="(!isMstVerified && !isEditMode)"
        />
      </label>
      <label class="employer-field">
        <span>{{ $t('company.social.instagram') }}</span>
        <UInput
          v-model.trim="form.instagramLink"
          class="w-full"
          :placeholder="$t('company.form.placeholderInstagram')"
          :disabled="(!isMstVerified && !isEditMode)"
        />
      </label>
      <label class="employer-field">
        <span>{{ $t('company.social.linkedin') }}</span>
        <UInput
          v-model.trim="form.linkedInLink"
          class="w-full"
          :placeholder="$t('company.form.placeholderLinkedIn')"
          :disabled="(!isMstVerified && !isEditMode)"
        />
      </label>
    </div>

    <label class="employer-field employer-field-full">
      <span>{{ $t('company.form.videoTitle') }}</span>
      <UInput
        v-model.trim="form.videoUrl"
        type="url"
        class="w-full"
        :placeholder="$t('company.form.placeholderVideo')"
        :disabled="(!isMstVerified && !isEditMode)"
      />
    </label>

    <div class="employer-field employer-field-full">
      <span>
        {{ $t('company.form.logoTitle') }}
        <span class="employer-required-star">{{ $t('common.requiredMark') }}</span>
      </span>
      <div
        class="employer-admin-company-upload-zone"
        :class="[
          isDragging ? 'is-dragging' : '',
          formDisabled ? 'is-disabled' : '',
        ]"
        @click.stop="openLogoPicker"
        @dragover.prevent="!formDisabled && (isDragging = true)"
        @dragleave="!formDisabled && (isDragging = false)"
        @drop.prevent="!formDisabled && onDropLogo($event)"
      >
        <input
          ref="logoInput"
          type="file"
          :accept="IMAGE_UPLOAD_ACCEPT"
          class="hidden"
          tabindex="-1"
          @change="onPickLogo"
        />
        <div v-if="logoPreview" class="flex justify-center">
          <div class="relative p-3 bg-white rounded-xl border border-gray-200 shadow-sm inline-flex items-center justify-center min-w-[160px] min-h-[160px] w-44 h-44 overflow-hidden">
            <img :src="logoPreview" class="w-full h-full object-contain rounded-lg" draggable="false" />
            <div class="absolute bottom-2 right-2 flex items-center gap-1.5">
              <UButton
                icon="i-lucide-crop"
                color="primary"
                size="xs"
                variant="solid"
                class="shadow-sm"
                :aria-label="$t('common.cropImage')"
                :disabled="formDisabled"
                @click.stop="openCropModal"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                size="xs"
                variant="solid"
                class="shadow-sm"
                :disabled="formDisabled"
                @click.stop="removeLogo"
              />
            </div>
          </div>
        </div>
        <div v-else class="grid place-items-center">
          <div
            class="h-9 w-9 rounded-xl bg-[#eef5ff] grid place-items-center"
            style="border: 1px solid rgba(29, 36, 51, 0.10)"
          >
            <UIcon name="i-lucide-upload" class="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
      <p v-if="errors.logo" class="employer-field-error">{{ errors.logo }}</p>
    </div>

    <div class="employer-field employer-field-full">
      <span>{{ $t('company.form.addMore') }}</span>
      <div
        class="employer-admin-company-upload-zone"
        :class="formDisabled ? 'is-disabled' : ''"
        @click.stop="openImagesPicker"
      >
        <input ref="imagesInput" type="file" :accept="IMAGE_UPLOAD_ACCEPT" multiple class="hidden" @change="onPickImages" />
        <div v-if="imagePreviews.length" class="flex flex-wrap gap-2">
          <div v-for="(src, i) in imagePreviews" :key="i" class="relative">
            <img :src="src" class="h-20 w-auto object-contain rounded border" />
            <UButton icon="i-lucide-x" size="xs" color="error" class="absolute -top-1 -right-1" @click.stop="removeImage(i)" />
          </div>
          <UButton size="xs" variant="soft" @click.stop="imagesInput?.click()">{{ $t('company.form.addMore') }}</UButton>
        </div>
        <div v-else class="grid place-items-center">
          <div
            class="h-9 w-9 rounded-xl bg-[#eef5ff] grid place-items-center"
            style="border: 1px solid rgba(29, 36, 51, 0.10)"
          >
            <UIcon name="i-lucide-upload" class="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>

    <div class="employer-field employer-field-full">
      <span>{{ $t('company.form.bannerTitle') }}</span>
      <div
        class="employer-admin-company-upload-zone"
        :class="formDisabled ? 'is-disabled' : ''"
        @click.stop="openBannerPicker"
      >
        <input ref="bannerInput" type="file" :accept="IMAGE_UPLOAD_ACCEPT" class="hidden" @change="onPickBanner" />
        <img v-if="bannerPreview" :src="bannerPreview" class="max-h-24 mx-auto object-contain rounded" />
        <div v-else class="grid place-items-center">
          <div
            class="h-9 w-9 rounded-xl bg-[#eef5ff] grid place-items-center"
            style="border: 1px solid rgba(29, 36, 51, 0.10)"
          >
            <UIcon name="i-lucide-upload" class="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <UButton v-if="bannerPreview" size="xs" color="error" class="mt-2" @click.stop="removeBanner">Xóa</UButton>
      </div>
    </div>

    <div class="employer-company-section employer-admin-company-drawer-admin">
      <h3 class="employer-admin-company-drawer-section-title">Company setting by Admin</h3>
      <label class="employer-admin-company-featured">
        <span class="employer-admin-company-featured-label">Display on Homepage (Optional)</span>
        <span class="employer-admin-company-featured-control">
          <UCheckbox v-model="form.isFeatured" />
          <span>Featured</span>
        </span>
      </label>
      <label class="employer-field employer-field-full">
        <span>Status <span class="employer-required-star">{{ $t('common.requiredMark') }}</span></span>
        <div class="employer-admin-company-status-row">
          <button
            type="button"
            class="employer-admin-company-status-btn"
            :class="{ 'is-active is-approved': form.isWaiting === false }"
            @click="form.isWaiting = false"
          >
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Đã duyệt
          </button>
          <button
            type="button"
            class="employer-admin-company-status-btn"
            :class="{ 'is-active is-pending': form.isWaiting === true }"
            @click="form.isWaiting = true"
          >
            <UIcon name="i-lucide-clock" class="w-4 h-4" />
            Chưa duyệt
          </button>
        </div>
      </label>
    </div>

    <div class="employer-admin-drawer-form-actions">
      <UButton type="submit" color="primary" :loading="loading">
        {{ isEditMode ? ($t('company.editCompany.editCompanyContent') || 'Cập nhật') : $t('company.form.createBtn') }}
      </UButton>
      <UButton type="button" variant="outline" color="neutral" :disabled="loading" @click="$emit('cancel')">
        Hủy
      </UButton>
    </div>

    <!-- Crop Modal (logo): Teleport ra body để full màn hình; parent giữ drawer mở khi crop đang mở -->
    <Teleport to="body">
      <div
        v-if="showCropModal"
        class="employer-admin-crop-modal"
        @mousedown.self.prevent
        @click.self="closeCropModal"
      >
        <div
          class="employer-admin-crop-modal-dialog"
          @mousedown.stop
          @click.stop
        >
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold">{{ $t('common.cropImage') }}</h3>
            <UButton
              type="button"
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="neutral"
              @mousedown.stop
              @click.stop.prevent="closeCropModal"
            />
          </div>
          <div class="p-4 overflow-auto flex-1 bg-gray-900/10">
            <div
              ref="cropContainer"
              class="relative w-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center select-none"
              style="min-height: 420px; max-height: 560px"
            >
              <img
                v-if="cropImageSrc"
                ref="cropImage"
                :src="cropImageSrc"
                class="pointer-events-none select-none"
                style="display: block; max-width: 100%; max-height: 500px; width: auto; height: auto"
                draggable="false"
                @load="initCrop"
              />
              <div
                v-if="showCropArea"
                ref="cropArea"
                class="absolute border-2 border-orange-500 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] rounded-lg overflow-visible"
                :style="cropAreaStyle"
                @mousedown.prevent="startCropDrag"
                @touchstart.prevent="startCropDrag"
              >
                <!-- Rule-of-thirds grid -->
                <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div class="border-r border-b border-white"></div>
                  <div class="border-r border-b border-white"></div>
                  <div class="border-b border-white"></div>
                  <div class="border-r border-b border-white"></div>
                  <div class="border-r border-b border-white"></div>
                  <div class="border-b border-white"></div>
                  <div class="border-r border-white"></div>
                  <div class="border-r border-white"></div>
                  <div></div>
                </div>

                <div class="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold select-none pointer-events-none drop-shadow">
                  <span class="bg-black/60 px-2 py-0.5 rounded text-[11px]">
                    1 : 1
                  </span>
                </div>

                <div
                  class="absolute w-4 h-4 bg-orange-500 border-2 border-white rounded-full cursor-nwse-resize shadow-md -top-2 -left-2"
                  @mousedown.stop.prevent="(e) => startResize('nw', e)"
                  @touchstart.stop.prevent="(e) => startResize('nw', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-orange-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md -top-2 -right-2"
                  @mousedown.stop.prevent="(e) => startResize('ne', e)"
                  @touchstart.stop.prevent="(e) => startResize('ne', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-orange-500 border-2 border-white rounded-full cursor-nwse-resize shadow-md -bottom-2 -right-2"
                  @mousedown.stop.prevent="(e) => startResize('se', e)"
                  @touchstart.stop.prevent="(e) => startResize('se', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-orange-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md -bottom-2 -left-2"
                  @mousedown.stop.prevent="(e) => startResize('sw', e)"
                  @touchstart.stop.prevent="(e) => startResize('sw', e)"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              :label="$t('common.cancel')"
              @mousedown.stop
              @click.stop.prevent="closeCropModal"
            />
            <UButton
              type="button"
              color="primary"
              :label="$t('common.confirm')"
              @mousedown.stop
              @click.stop.prevent="applyCrop"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </form>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { CompanyAddUpdateEntity } from '~/entities/company'
import RichTextEditor from '~/components/RichTextEditor.vue'
import { adminJobDrawerCompanySelectControlUi } from '~/utils/admin-drawer-ui'
import { handleMstInput, isValidMstFormat, normalizeMstDigits, getMstLookupVariants } from '~/utils/mst'
import { normalizeCompanyLogo } from '~/utils/companyLogo'
import { IMAGE_UPLOAD_ACCEPT, validateImageUploadFile } from '~/utils/imageUploadValidation'
import {
  companySizeSelectItems,
  resolveCompanySizeForSave,
  resolveCompanySizeForSelect,
} from '~/constants/company-size'

const orgTypeSelectUi = adminJobDrawerCompanySelectControlUi

const props = defineProps<{
  /** Khi set = dữ liệu công ty từ list (edit mode), không cần gọi API get-by-id */
  initialCompany?: any | null
}>()

const { t } = useI18n()
const { $api } = useNuxtApp()
const { organizationTypeItemsSearchable } = useJobFilters()

const emit = defineEmits<{ success: []; cancel: []; cropOpen: []; cropClosed: [] }>()

const isEditMode = computed(() => !!props.initialCompany?.id)

const formDisabled = computed(() => !isMstVerified.value && !isEditMode.value)

const { loadForCrop } = useImageCropSource()

const loading = ref(false)
const form = ref<CompanyAddUpdateEntity>(getDefaultForm())
const companySizeFromDb = ref<number | null>(null)
const companySizeDirty = ref(false)

/** MST Validation State */
const isMstVerified = ref(false)
const isNameAutoFilled = ref(false)
const mstChecking = ref(false)
const mstError = ref('')
const mstDebounceTimer = ref<any>(null)
/** Handle MST Change (chỉ reset trạng thái, không tự động tra cứu khi gõ) */
function onMstInput(event: Event) {
  handleMstInput(event, (value) => {
    form.value.mst = value
  })

  mstError.value = ''
  errors.value.mst = ''

  // Khi người dùng thay đổi MST, cần xác thực lại
  isMstVerified.value = false
  isNameAutoFilled.value = false
}

/** Validate MST: Chỉ chạy khi bấm nút "Kiểm tra" hoặc nhấn Enter */
async function validateMst() {
  const rawMst = form.value.mst?.trim() || ''
  if (!rawMst) {
    mstError.value = 'Vui lòng nhập mã số thuế.'
    return
  }

  const digits = normalizeMstDigits(rawMst)
  if (!isValidMstFormat(digits)) {
    mstError.value = 'Mã số thuế không đúng định dạng (phải gồm 10 hoặc 13 chữ số).'
    return
  }

  mstChecking.value = true
  mstError.value = ''

  try {
    // Step 1: Check if MST already exists in our database
    const variants = getMstLookupVariants(rawMst)
    for (const variant of variants) {
      try {
        const existingCompany = await $api.company.checkExistMst(variant)
        if (existingCompany?.id) {
          mstError.value = 'MST đã tồn tại trong hệ thống.'
          useNotify({ message: 'MST đã tồn tại trong hệ thống.', type: 'error' })
          isMstVerified.value = false
          return
        }
      } catch {
        // Chưa có trong DB -> tiếp tục
      }
    }

    // Step 2: Check with external MST API (VietQR)
    try {
      const externalData = await $api.company.getCompanyByMst(rawMst)
      if (externalData?.data?.name) {
        // Tìm thấy trong hệ thống VietQR - tự động điền
        form.value.name = externalData.data.name || form.value.name
        form.value.taxAddress = externalData.data.address || form.value.taxAddress
        isNameAutoFilled.value = true
        isMstVerified.value = true
        mstError.value = ''

        useNotify({
          message: 'Đã tìm thấy thông tin từ hệ thống. Vui lòng kiểm tra và điền các thông tin còn lại.',
          type: 'success',
        })
      } else {
        mstError.value = 'Không tìm thấy MST trong hệ thống.'
        useNotify({ message: 'Không tìm thấy MST trong hệ thống.', type: 'error' })
        isMstVerified.value = false
      }
    } catch (err: any) {
      const status = err?.statusCode || err?.status || err?.response?.status
      if (status === 429) {
        mstError.value = 'Hệ thống tra cứu đang bận, vui lòng thử lại sau vài giây.'
        useNotify({ message: 'Hệ thống tra cứu đang bận, vui lòng thử lại sau vài giây.', type: 'error' })
      } else {
        mstError.value = 'Không tìm thấy MST trong hệ thống.'
        useNotify({ message: 'Không tìm thấy MST trong hệ thống.', type: 'error' })
      }
      isMstVerified.value = false
    }
  } finally {
    mstChecking.value = false
  }
}

function getDefaultForm(): CompanyAddUpdateEntity {
  return {
    name: '',
    mst: null,
    address: '',
    taxAddress: '',
    website: '',
    organizationType: 0,
    companySize: null,
    foundedYear: null,
    description: '',
    insight: '',
    overview: '',
    logo: '',
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedInLink: '',
    videoUrl: '',
    isWaiting: true,
    isFeatured: false,
    companyImages: [],
    bannerImage: null,
  } as CompanyAddUpdateEntity
}

const errors = ref<Record<string, string>>({})
const isDragging = ref(false)

const logoInput = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

/** Crop modal (logo) */
const showCropModal = ref(false)
const cropImageSrc = ref<string | null>(null)
const cropContainer = ref<HTMLElement | null>(null)
const cropImage = ref<HTMLImageElement | null>(null)
const cropArea = ref<HTMLElement | null>(null)
const showCropArea = ref(false)
const currentCrop = ref({ left: 0, top: 0, size: 150 })
const cropAreaStart = ref({ left: 0, top: 0, size: 0 })
const cropAreaStyle = ref<Record<string, string>>({})
const isDraggingCrop = ref(false)
const isResizingCrop = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })

const imagesInput = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

// Track deleted image URLs for cleanup on R2 when editing
const deletedImageUrls = ref<string[]>([])

const bannerInput = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)

function fillFormFromCompany(company: any) {
  console.log('[AdminCompanyForm] fillFormFromCompany called with:', company)
  console.log('[AdminCompanyForm] company.id:', company?.id)
  form.value = {
    id: company.id,
    name: company.name ?? '',
    mst: company.mst ?? null,
    address: company.address ?? '',
    taxAddress: company.taxAddress ?? null,
    website: company.website ?? null,
    organizationType: company.organizationType ?? 0,
    companySize: resolveCompanySizeForSelect(company.companySize),
    foundedYear: company.foundedYear ?? null,
    description: company.description ?? null,
    insight: company.insight ?? null,
    overview: company.overview ?? null,
    logo: company.logo ?? null,
    facebookLink: company.facebookLink ?? null,
    twitterLink: company.twitterLink ?? null,
    instagramLink: company.instagramLink ?? null,
    linkedInLink: company.linkedInLink ?? null,
    videoUrl: company.videoUrl ?? null,
    isWaiting: !!company.isWaiting,
    isFeatured: !!company.isFeatured,
    companyImages: Array.isArray(company.companyImages) ? company.companyImages.map((img: any) => ({ url: img?.url ?? '' })) : [],
    bannerImage: company.bannerImage ?? null,
  }
  companySizeFromDb.value = company.companySize ?? null
  companySizeDirty.value = false
  console.log('[AdminCompanyForm] form after fill:', form.value)
  logoPreview.value = normalizeCompanyLogo(company.logo)
  bannerPreview.value = company.bannerImage || null
  imagePreviews.value = Array.isArray(company.companyImages) ? company.companyImages.map((img: any) => img?.url ?? '') : []
  imageFiles.value = []
  logoFile.value = null
  bannerFile.value = null
  // Reset deleted URLs tracking
  deletedImageUrls.value = []
  // In edit mode, MST is already verified (no need to re-verify)
  isMstVerified.value = true
  isNameAutoFilled.value = false
  mstError.value = ''
  console.log('[AdminCompanyForm] isEditMode:', !!company.id, 'isMstVerified:', isMstVerified.value)
}

function resetForm() {
  form.value = getDefaultForm()
  companySizeFromDb.value = null
  companySizeDirty.value = false
  errors.value = {}
  logoPreview.value = null
  logoFile.value = null
  bannerPreview.value = null
  bannerFile.value = null
  imagePreviews.value = []
  imageFiles.value = []
  deletedImageUrls.value = [] // Reset deleted URLs tracking
  // Reset MST validation state
  isMstVerified.value = false
  isNameAutoFilled.value = false
  mstError.value = ''
  mstChecking.value = false
  if (mstDebounceTimer.value) {
    clearTimeout(mstDebounceTimer.value)
    mstDebounceTimer.value = null
  }
}

watch(
  () => props.initialCompany,
  (company) => {
    if (company?.id) {
      fillFormFromCompany(company)
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

function handleLogoFilePicked(file: File) {
  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    if (logoInput.value) logoInput.value.value = ''
    return
  }

  // Tự động mở modal crop ảnh khi chọn file
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    if (dataUrl) {
      cropImageSrc.value = dataUrl
      showCropArea.value = false
      showCropModal.value = true
      emit('cropOpen')
    }
  }
  reader.onerror = () => {
    useNotify({ message: 'Không thể đọc tệp ảnh', type: 'error' })
  }
  reader.readAsDataURL(file)
  if (logoInput.value) logoInput.value.value = ''
}

function onPickLogo(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    input.value = ''
    return
  }

  handleLogoFilePicked(file)
}

function onDropLogo(e: DragEvent) {
  if (formDisabled.value) return
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) return

  handleLogoFilePicked(file)
}

function openLogoPicker() {
  if (formDisabled.value) return
  logoInput.value?.click()
}

function openImagesPicker() {
  if (formDisabled.value) return
  imagesInput.value?.click()
}

function openBannerPicker() {
  if (formDisabled.value) return
  bannerInput.value?.click()
}

function setLogoFile(file: File) {
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
  form.value.logo = null
  errors.value.logo = ''
  if (logoInput.value) logoInput.value.value = ''
}
function removeLogo() {
  // Track URL deletion for R2 cleanup (only for existing URLs, not blobs)
  if (form.value.logo && !form.value.logo.startsWith('blob:')) {
    deletedImageUrls.value.push(form.value.logo)
  }
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoFile.value = null
  logoPreview.value = null
  form.value.logo = null
}

async function openCropModal() {
  if (!logoPreview.value || showCropModal.value) return

  try {
    const src = await loadForCrop(logoPreview.value)
    cropImageSrc.value = src
    showCropArea.value = false
    showCropModal.value = true
    emit('cropOpen')
    await nextTick()
  } catch (err) {
    console.error('Error loading image for crop:', err)
    useNotify({ message: 'Không thể tải ảnh để cắt', type: 'error' })
  }
}

const CROP_MODAL_CLOSE_GUARD_MS = 480

function finishCropModalClose() {
  if (import.meta.client) {
    document.documentElement.classList.remove('employer-admin-crop-modal-open')
  }
  emit('cropClosed')
}

function closeCropModal() {
  if (!showCropModal.value) return
  showCropModal.value = false
  cropImageSrc.value = null
  showCropArea.value = false
  // Trì hoãn bỏ chặn drawer/backdrop để click đóng crop không lọt xuống đóng drawer
  window.setTimeout(finishCropModalClose, CROP_MODAL_CLOSE_GUARD_MS)
}

watch(showCropModal, (open) => {
  if (!import.meta.client) return
  if (open) {
    document.documentElement.classList.add('employer-admin-crop-modal-open')
  }
})

function initCrop() {
  if (!cropImage.value || !cropContainer.value) return

  const placeCropArea = () => {
    const img = cropImage.value
    const container = cropContainer.value
    if (!img || !container) return false

    const containerRect = container.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()
    if (containerRect.width <= 0 || imgRect.width <= 0 || imgRect.height <= 0) {
      return false
    }

    // Khóa tỉ lệ 1:1 cho logo: lấy 80% cạnh nhỏ nhất của ảnh
    const size = Math.round(Math.min(imgRect.width, imgRect.height) * 0.8)
    const cropLeft = Math.round(
      imgRect.left - containerRect.left + (imgRect.width - size) / 2,
    )
    const cropTop = Math.round(
      imgRect.top - containerRect.top + (imgRect.height - size) / 2,
    )

    currentCrop.value = {
      left: cropLeft,
      top: cropTop,
      size,
    }

    cropAreaStyle.value = {
      left: `${cropLeft}px`,
      top: `${cropTop}px`,
      width: `${size}px`,
      height: `${size}px`,
    }

    showCropArea.value = true
    return true
  }

  nextTick(() => {
    if (placeCropArea()) return
    requestAnimationFrame(() => {
      if (placeCropArea()) return
      setTimeout(placeCropArea, 50)
    })
  })
}

function startCropDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value || !cropImage.value) return

  isDraggingCrop.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  dragStart.value = { x: clientX, y: clientY }
  cropAreaStart.value = {
    left: currentCrop.value.left,
    top: currentCrop.value.top,
    size: currentCrop.value.size,
  }

  document.addEventListener('mousemove', handleCropDrag, { passive: false })
  document.addEventListener('mouseup', stopCropDrag)
  document.addEventListener('touchmove', handleCropDrag, { passive: false })
  document.addEventListener('touchend', stopCropDrag)
}

function handleCropDrag(e: MouseEvent | TouchEvent) {
  if (!isDraggingCrop.value || !cropContainer.value || !cropImage.value) return

  e.preventDefault()
  e.stopPropagation()

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y

  const containerRect = cropContainer.value.getBoundingClientRect()
  const imgRect = cropImage.value.getBoundingClientRect()

  // Giới hạn tuyệt đối trong phạm vi ảnh
  const minLeft = imgRect.left - containerRect.left
  const maxLeft = minLeft + imgRect.width - cropAreaStart.value.size
  const minTop = imgRect.top - containerRect.top
  const maxTop = minTop + imgRect.height - cropAreaStart.value.size

  let newLeft = cropAreaStart.value.left + deltaX
  let newTop = cropAreaStart.value.top + deltaY

  newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft))
  newTop = Math.max(minTop, Math.min(maxTop, newTop))

  currentCrop.value.left = newLeft
  currentCrop.value.top = newTop

  cropAreaStyle.value = {
    left: `${newLeft}px`,
    top: `${newTop}px`,
    width: `${cropAreaStart.value.size}px`,
    height: `${cropAreaStart.value.size}px`,
  }
}

function stopCropDrag(e?: MouseEvent | TouchEvent) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  isDraggingCrop.value = false
  document.removeEventListener('mousemove', handleCropDrag)
  document.removeEventListener('mouseup', stopCropDrag)
  document.removeEventListener('touchmove', handleCropDrag)
  document.removeEventListener('touchend', stopCropDrag)
}

function startResize(direction: string, e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value || !cropImage.value) return

  isResizingCrop.value = true
  resizeDirection.value = direction
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  dragStart.value = { x: clientX, y: clientY }
  cropAreaStart.value = {
    left: currentCrop.value.left,
    top: currentCrop.value.top,
    size: currentCrop.value.size,
  }
  document.addEventListener('mousemove', handleResize, { passive: false })
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize, { passive: false })
  document.addEventListener('touchend', stopResize)
}

function handleResize(e: MouseEvent | TouchEvent) {
  if (!isResizingCrop.value || !cropContainer.value || !cropImage.value) return

  e.preventDefault()
  e.stopPropagation()

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y

  const containerRect = cropContainer.value.getBoundingClientRect()
  const imgRect = cropImage.value.getBoundingClientRect()

  const imgLeft = imgRect.left - containerRect.left
  const imgTop = imgRect.top - containerRect.top
  const imgRight = imgLeft + imgRect.width
  const imgBottom = imgTop + imgRect.height

  const minSize = 60
  let newSize = cropAreaStart.value.size
  let newLeft = cropAreaStart.value.left
  let newTop = cropAreaStart.value.top

  // Khóa tỉ lệ vuông 1:1 và giới hạn không được vượt quá khung ảnh
  if (resizeDirection.value === 'se') {
    const anchorX = cropAreaStart.value.left
    const anchorY = cropAreaStart.value.top
    const maxAvailable = Math.min(imgRight - anchorX, imgBottom - anchorY)
    const delta = (deltaX + deltaY) / 2
    newSize = Math.max(minSize, Math.min(maxAvailable, cropAreaStart.value.size + delta))
    newLeft = anchorX
    newTop = anchorY
  } else if (resizeDirection.value === 'nw') {
    const anchorX = cropAreaStart.value.left + cropAreaStart.value.size
    const anchorY = cropAreaStart.value.top + cropAreaStart.value.size
    const maxAvailable = Math.min(anchorX - imgLeft, anchorY - imgTop)
    const delta = (-deltaX - deltaY) / 2
    newSize = Math.max(minSize, Math.min(maxAvailable, cropAreaStart.value.size + delta))
    newLeft = anchorX - newSize
    newTop = anchorY - newSize
  } else if (resizeDirection.value === 'ne') {
    const anchorX = cropAreaStart.value.left
    const anchorY = cropAreaStart.value.top + cropAreaStart.value.size
    const maxAvailable = Math.min(imgRight - anchorX, anchorY - imgTop)
    const delta = (deltaX - deltaY) / 2
    newSize = Math.max(minSize, Math.min(maxAvailable, cropAreaStart.value.size + delta))
    newLeft = anchorX
    newTop = anchorY - newSize
  } else if (resizeDirection.value === 'sw') {
    const anchorX = cropAreaStart.value.left + cropAreaStart.value.size
    const anchorY = cropAreaStart.value.top
    const maxAvailable = Math.min(anchorX - imgLeft, imgBottom - anchorY)
    const delta = (-deltaX + deltaY) / 2
    newSize = Math.max(minSize, Math.min(maxAvailable, cropAreaStart.value.size + delta))
    newLeft = anchorX - newSize
    newTop = anchorY
  }

  currentCrop.value = {
    left: newLeft,
    top: newTop,
    size: newSize,
  }

  cropAreaStyle.value = {
    left: `${newLeft}px`,
    top: `${newTop}px`,
    width: `${newSize}px`,
    height: `${newSize}px`,
  }
}

function stopResize(e?: MouseEvent | TouchEvent) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  isResizingCrop.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
}

async function applyCrop() {
  if (!cropImageSrc.value || !cropImage.value || !cropContainer.value) return

  try {
    const img = cropImage.value
    const containerRect = cropContainer.value.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    const scaleX = img.naturalWidth / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height

    // Tọa độ vùng cắt tương đối so với kích thước gốc của ảnh
    const relLeft = currentCrop.value.left - (imgRect.left - containerRect.left)
    const relTop = currentCrop.value.top - (imgRect.top - containerRect.top)

    let cropX = Math.round(relLeft * scaleX)
    let cropY = Math.round(relTop * scaleY)
    let cropSize = Math.round(currentCrop.value.size * scaleX)

    // Khóa chặt chẽ trong phạm vi ảnh gốc, không để số âm hoặc tràn
    const maxNaturalSize = Math.min(img.naturalWidth, img.naturalHeight)
    cropSize = Math.max(10, Math.min(cropSize, maxNaturalSize))
    cropX = Math.max(0, Math.min(cropX, img.naturalWidth - cropSize))
    cropY = Math.max(0, Math.min(cropY, img.naturalHeight - cropSize))

    // Cắt ảnh bằng HTML Canvas chuẩn (hỗ trợ 100% trình duyệt, mượt và sắc nét)
    const outputSize = Math.min(cropSize, 512)
    const canvas = document.createElement('canvas')
    canvas.width = outputSize
    canvas.height = outputSize
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Không thể khởi tạo canvas 2D')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, outputSize, outputSize)

    const croppedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
    })

    const croppedFile = new File([croppedBlob], logoFile.value?.name || 'logo.png', { type: 'image/png' })

    if (logoPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview.value)
    }

    logoFile.value = croppedFile
    logoPreview.value = URL.createObjectURL(croppedBlob)
    errors.value.logo = ''

    closeCropModal()
  } catch (err) {
    console.error('Error cropping image:', err)
    useNotify({ message: 'Có lỗi xảy ra khi cắt ảnh. Vui lòng thử lại.' })
  }
}

function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  for (const f of Array.from(files)) {
    const validationError = validateImageUploadFile(f)
    if (validationError) {
      useNotify({ type: 'error', message: validationError })
      continue
    }
    imageFiles.value.push(f)
    imagePreviews.value.push(URL.createObjectURL(f))
  }
  if (imagesInput.value) imagesInput.value.value = ''
}

function removeImage(i: number) {
  const removedPreview = imagePreviews.value[i]
  // Track URL deletion for R2 cleanup (only for existing URLs, not blobs)
  if (removedPreview && !removedPreview.startsWith('blob:')) {
    deletedImageUrls.value.push(removedPreview)
  }
  if (removedPreview?.startsWith('blob:')) {
    URL.revokeObjectURL(removedPreview)
  }
  // Also remove from form.companyImages to keep in sync
  const formUrls = form.value.companyImages.map((img: any) => img.url).filter(Boolean)
  if (i >= 0 && i < formUrls.length) {
    const removedUrl = formUrls[i]
    if (removedUrl && !removedUrl.startsWith('blob:')) {
      deletedImageUrls.value.push(removedUrl)
    }
    formUrls.splice(i, 1)
    form.value.companyImages = formUrls.map((url: string) => ({ url }))
  }
  imagePreviews.value.splice(i, 1)
  // Only splice imageFiles if it's a new file (index < imageFiles.length)
  if (i < imageFiles.value.length) {
    imageFiles.value.splice(i, 1)
  }
}

function onPickBanner(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    input.value = ''
    return
  }

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    input.value = ''
    return
  }

  if (bannerPreview.value?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview.value)
  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
  if (bannerInput.value) bannerInput.value.value = ''
}

function removeBanner() {
  // Track URL deletion for R2 cleanup (only for existing URLs, not blobs)
  if (form.value.bannerImage && !form.value.bannerImage.startsWith('blob:')) {
    deletedImageUrls.value.push(form.value.bannerImage)
  }
  if (bannerPreview.value?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview.value)
  bannerFile.value = null
  bannerPreview.value = null
  form.value.bannerImage = null
}

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.documentElement.classList.remove('employer-admin-crop-modal-open')
  }
  if (showCropModal.value) {
    emit('cropClosed')
  }
  ;[logoPreview.value, bannerPreview.value, ...imagePreviews.value].forEach((url) => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
  })
})

async function dataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()

    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

function validate(): boolean {
  errors.value = {}
  let ok = true

  // In add mode, require MST verification before allowing submit
  if (!isEditMode.value && !isMstVerified.value) {
    errors.value.mst = 'Vui lòng nhập và xác thực MST trước.'
    ok = false
  }

  if (!form.value.name?.trim()) {
    errors.value.name = t('company.form.errName')
    ok = false
  }
  if (!form.value.mst?.trim()) {
    errors.value.mst = 'Vui lòng nhập MST.'
    ok = false
  }
  const addressHtml = form.value.address || ''
  const cleanAddress = addressHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  if (!cleanAddress) {
    errors.value.address = t('company.form.errAddress')
    ok = false
  }
  if (!form.value.organizationType) {
    errors.value.organizationType = t('company.form.errOrgType')
    ok = false
  }
  if (form.value.website && !/^https?:\/\/.+/i.test(form.value.website)) {
    errors.value.website = t('company.form.errWebsite')
    ok = false
  }
  if (form.value.foundedYear != null && (form.value.foundedYear < 1800 || form.value.foundedYear > 2100 || !Number.isInteger(form.value.foundedYear))) {
    errors.value.foundedYear = 'Năm thành lập từ 1800 đến 2100.'
    ok = false
  }
  // Logo validation: required - must have either new file OR existing URL (not deleted)
  // Logo validation: must have logo (either new file or existing URL in preview)
  if (!logoFile.value && !logoPreview.value) {
    errors.value.logo = 'Vui lòng chọn logo.'
    ok = false
  }
  if (!ok) useNotify({ type: 'error', message: 'Vui lòng nhập đúng các thông tin.' })

  return ok
}

async function onSubmit() {
  // Debug log
  console.log('=== FORM SUBMIT DATA ===')
  console.log('form.value:', form.value)
  console.log('isEditMode:', isEditMode.value)
  console.log('logoFile:', logoFile.value)
  console.log('bannerFile:', bannerFile.value)
  console.log('imageFiles:', imageFiles.value)
  console.log('deletedImageUrls:', deletedImageUrls.value)
  console.log('=========================')

  if (!validate()) return

  loading.value = true

  try {
    // Build submission data - create a clean object to avoid reactivity issues
    const formData = JSON.parse(JSON.stringify(form.value))
    const { id: _, ...formDataWithoutId } = formData

    // Step 1: Delete removed images from R2
    if (deletedImageUrls.value.length > 0) {
      await $api.upload.deleteBatchR2(deletedImageUrls.value)
    }

    // Step 2: Upload new images to R2 and build final URLs
    let logoUrl: string | null = formDataWithoutId.logo || null
    let bannerUrl: string | null = formDataWithoutId.bannerImage || null
    let companyImageUrls: string[] = Array.isArray(formDataWithoutId.companyImages)
      ? formDataWithoutId.companyImages.map((img: any) => img.url).filter(Boolean)
      : []

    // Upload logo if new file selected
    if (logoFile.value) {
      const url = await $api.upload.uploadImageR2(logoFile.value, 'logo')
      if (url) logoUrl = url
    }

    // Upload banner if new file selected
    if (bannerFile.value) {
      const url = await $api.upload.uploadImageR2(bannerFile.value, 'banner')
      if (url) bannerUrl = url
    }

    // Upload company images if new files selected
    if (imageFiles.value.length > 0) {
      for (const file of imageFiles.value) {
        const url = await $api.upload.uploadImageR2(file, 'company-images')
        if (url) companyImageUrls.push(url)
      }
    }

    // Build final submit data
    const submitData: CompanyAddUpdateEntity = {
      ...formDataWithoutId,
      companySize: resolveCompanySizeForSave(
        companySizeFromDb.value,
        formDataWithoutId.companySize,
        companySizeDirty.value,
      ) ?? null,
      logo: logoUrl || null,
      companyImages: companyImageUrls.map((url) => ({ url })),
      bannerImage: bannerUrl || null,
      mst: formDataWithoutId.mst || null,
      website: formDataWithoutId.website || null,
      facebookLink: formDataWithoutId.facebookLink || null,
      twitterLink: formDataWithoutId.twitterLink || null,
      linkedInLink: formDataWithoutId.linkedInLink || null,
      instagramLink: formDataWithoutId.instagramLink || null,
      videoUrl: formDataWithoutId.videoUrl || null,
      description: formDataWithoutId.description || null,
      insight: formDataWithoutId.insight || null,
      overview: formDataWithoutId.overview || null,
      taxAddress: formDataWithoutId.taxAddress || null,
    }

    // Ensure companyImages is always an array
    if (!Array.isArray(submitData.companyImages)) {
      submitData.companyImages = []
    }

    console.log('=== SUBMIT DATA ===')
    console.log('submitData:', submitData)
    console.log('=========================')

    if (form.value.id) {
      await $api.company.editCompany(form.value.id, submitData)
      useNotify({ message: (t('company.editCompany.editCompanyComplete') as string) || 'Cập nhật công ty thành công.', type: 'success' })
    } else {
      await $api.company.addCompany(submitData)
      useNotify({ message: t('company.form.createSuccess') as string, type: 'success' })
    }
    closeCropModal()
    emit('success')
  } catch (e: any) {
    console.error('=== SUBMIT ERROR ===')
    console.error(e)
    console.error('=========================')
    useNotify({
      message: Array.isArray(e?.message) ? e.message[0] : e?.message || (form.value.id ? 'Cập nhật thất bại.' : t('company.form.createFailed')),
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
