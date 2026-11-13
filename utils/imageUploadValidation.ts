/** MIME được phép khi upload ảnh: JPEG, PNG, WebP */
export const IMAGE_UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp'

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const

export const IMAGE_UPLOAD_REJECTED_MESSAGE =
  'Định dạng tệp không hợp lệ. Chỉ cho phép JPEG, PNG và WebP.'

export const IMAGE_SIZE_REJECTED_MESSAGE =
  'Kích thước tệp không được vượt quá 5MB. Vui lòng chọn tệp nhỏ hơn.'

export function validateImageUploadFile(file: File): string | null {
  if (!file) return 'Chưa chọn tệp.'

  // Kiểm tra dung lượng (tối đa 5MB)
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return IMAGE_SIZE_REJECTED_MESSAGE
  }

  const fileName = (file.name || '').toLowerCase()
  const fileType = (file.type || '').toLowerCase()

  const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) => fileName.endsWith(ext))
  const hasValidMime = fileType ? ALLOWED_IMAGE_MIME_TYPES.has(fileType) : false

  // Nếu cả extension và MIME type đều không khớp định dạng cho phép
  if (!hasValidExt && !hasValidMime) {
    return IMAGE_UPLOAD_REJECTED_MESSAGE
  }

  return null
}

export function isAllowedImageUploadFile(file: File): boolean {
  return validateImageUploadFile(file) === null
}

/** @deprecated Dùng IMAGE_UPLOAD_ACCEPT */
export const LOGO_IMAGE_ACCEPT = IMAGE_UPLOAD_ACCEPT

/** @deprecated Dùng validateImageUploadFile */
export const validateLogoImageFile = validateImageUploadFile

/** @deprecated Dùng IMAGE_UPLOAD_REJECTED_MESSAGE */
export const LOGO_IMAGE_REJECTED_MESSAGE = IMAGE_UPLOAD_REJECTED_MESSAGE

/** @deprecated Dùng isAllowedImageUploadFile */
export const isAllowedLogoImageFile = isAllowedImageUploadFile
