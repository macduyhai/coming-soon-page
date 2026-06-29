#!/usr/bin/env bash
# =============================================================
#  ANM&CNCHP — Build & Package for Plesk (Mắt Bão) Deploy
#
#  Cách dùng:
#    bash build-deploy.sh              → dùng .env.local  (mặc định)
#    bash build-deploy.sh --prod       → dùng .env.production
#    bash build-deploy.sh --dev        → dùng .env.local  (tường minh)
#    bash build-deploy.sh --help       → xem hướng dẫn
#
#  Cơ chế env:
#    --prod  : Tạm ẩn .env.local để Next.js chỉ đọc .env.production
#              (Next.js luôn load .env.local sau .env.production;
#               ẩn .env.local đảm bảo giá trị production không bị ghi đè)
#    default : Build bình thường; Next.js tự đọc .env.local
# =============================================================
set -euo pipefail

# ── Colors ────────────────────────────────────────────────────
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ── Defaults ──────────────────────────────────────────────────
BUILD_MODE="local"           # local | production
ENV_FILE=".env.local"
ENV_BACKED_UP=false
OUT_DIR="out"
TIMESTAMP=$(date +"%Y%m%d-%H%M")
TOTAL_STEPS=5

# ── Helpers ───────────────────────────────────────────────────
step()   { echo -e "\n${CYAN}[${1}/${TOTAL_STEPS}]${NC} ${BOLD}${2}${NC}"; }
ok()     { echo -e "    ${GREEN}✓${NC}  ${1}"; }
warn()   { echo -e "    ${YELLOW}⚠${NC}  ${1}"; }
info()   { echo -e "    ${CYAN}i${NC}  ${1}"; }
fail()   { echo -e "\n${RED}✗ LỖI: ${1}${NC}\n"; exit 1; }
dim()    { echo -e "    ${DIM}${1}${NC}"; }

show_help() {
  echo ""
  echo -e "${BOLD}CÁCH DÙNG:${NC}"
  echo -e "  bash build-deploy.sh              Build với ${CYAN}.env.local${NC}  (mặc định)"
  echo -e "  bash build-deploy.sh --prod       Build với ${CYAN}.env.production${NC}"
  echo -e "  bash build-deploy.sh --dev        Build với ${CYAN}.env.local${NC}  (tường minh)"
  echo -e "  bash build-deploy.sh --help       Hiển thị hướng dẫn này"
  echo ""
  echo -e "${BOLD}ENV FILES:${NC}"
  echo -e "  .env.example      Template — commit lên git, chia sẻ cho team"
  echo -e "  .env.local        Phát triển local — KHÔNG commit"
  echo -e "  .env.production   Giá trị production — KHÔNG commit"
  echo ""
  echo -e "${BOLD}VÍ DỤ:${NC}"
  echo -e "  cp .env.example .env.production"
  echo -e "  # Sửa NEXT_PUBLIC_SIGNUP_ENDPOINT trong .env.production"
  echo -e "  bash build-deploy.sh --prod"
  echo ""
}

# ── Cleanup trap — chạy khi script thoát (kể cả khi lỗi) ─────
cleanup() {
  if [ "$ENV_BACKED_UP" = "true" ] && [ -f ".env.local.bak" ]; then
    mv ".env.local.bak" ".env.local"
    echo -e "\n${DIM}[cleanup] .env.local đã được khôi phục${NC}"
  fi
}
trap cleanup EXIT

# ── Parse arguments ───────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --prod|--production|production)
      BUILD_MODE="production"
      ENV_FILE=".env.production"
      shift
      ;;
    --dev|--local|local)
      BUILD_MODE="local"
      ENV_FILE=".env.local"
      shift
      ;;
    -h|--help|help)
      show_help
      exit 0
      ;;
    *)
      echo -e "${RED}Argument không hợp lệ: $1${NC}"
      show_help
      exit 1
      ;;
  esac
done

# Tên ZIP phân biệt theo mode
if [ "$BUILD_MODE" = "production" ]; then
  ZIP_NAME="canh-phong-deploy-${TIMESTAMP}-prod.zip"
else
  ZIP_NAME="canh-phong-deploy-${TIMESTAMP}.zip"
fi

# ── Banner ────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  ANM&CNCHP · Build & Package → Plesk Deploy        │${NC}"
echo -e "${CYAN}│  ANM&CNCHP — Chống Lừa Đảo Trực Tuyến TP Hải Phòng │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────┘${NC}"
echo ""
if [ "$BUILD_MODE" = "production" ]; then
  echo -e "  Mode: ${BOLD}${GREEN}PRODUCTION${NC}  |  Env: ${CYAN}${ENV_FILE}${NC}"
else
  echo -e "  Mode: ${BOLD}${YELLOW}LOCAL / DEV${NC}  |  Env: ${CYAN}${ENV_FILE}${NC}"
fi

# ── Step 1: Kiểm tra môi trường ───────────────────────────────
step 1 "Kiểm tra môi trường"

command -v node >/dev/null 2>&1 || fail "Node.js chưa được cài. Tải tại https://nodejs.org"
command -v npm  >/dev/null 2>&1 || fail "npm chưa được cài."
command -v zip  >/dev/null 2>&1 || fail "'zip' chưa có. Cài: brew install zip (macOS) | apt install zip (Linux)"

ok "Node $(node -v)  |  npm v$(npm -v)"

# ── Step 2: Kiểm tra env file ─────────────────────────────────
step 2 "Kiểm tra env file"

if [ -f "$ENV_FILE" ]; then
  # Đọc các key có giá trị (ẩn value để không lộ secrets)
  KEY_COUNT=$(grep -cE '^[A-Z_]+=.+' "$ENV_FILE" 2>/dev/null || echo 0)
  ok "${ENV_FILE} tìm thấy — ${KEY_COUNT} biến được cấu hình"
  # In các key (không in value)
  grep -E '^[A-Z_]+=.+' "$ENV_FILE" 2>/dev/null \
    | sed 's/=.*/=***/' \
    | while IFS= read -r line; do dim "  $line"; done || true
else
  if [ "$BUILD_MODE" = "production" ]; then
    fail "${ENV_FILE} không tìm thấy.\nTạo từ template: cp .env.example .env.production"
  else
    warn "${ENV_FILE} không tìm thấy — build với giá trị mặc định (UI-only)"
    info "Tạo từ template: cp .env.example .env.local"
  fi
fi

# Kiểm tra dependencies
if [ ! -d "node_modules" ]; then
  info "node_modules chưa có — đang chạy npm install..."
  npm install --silent
  ok "Packages đã được cài đặt"
else
  ok "node_modules đã tồn tại — bỏ qua npm install"
fi

# ── Step 3: Chuẩn bị env & Build ──────────────────────────────
step 3 "Build static export"

# Production: ẩn .env.local để không ghi đè .env.production
if [ "$BUILD_MODE" = "production" ] && [ -f ".env.local" ]; then
  mv ".env.local" ".env.local.bak"
  ENV_BACKED_UP=true
  warn ".env.local tạm thời ẩn → Next.js chỉ đọc .env.production"
fi

# Xóa build cũ
if [ -d "$OUT_DIR" ]; then
  rm -rf "$OUT_DIR"
  warn "Đã xóa build cũ (${OUT_DIR}/)"
fi

# Build
npm run build

# Kiểm tra output
[ -f "${OUT_DIR}/index.html" ] || fail "Build thất bại — không tìm thấy ${OUT_DIR}/index.html"
ok "Build thành công → ${OUT_DIR}/"

# Khôi phục .env.local ngay sau build (trap cũng làm điều này khi exit)
if [ "$ENV_BACKED_UP" = "true" ] && [ -f ".env.local.bak" ]; then
  mv ".env.local.bak" ".env.local"
  ENV_BACKED_UP=false
  ok ".env.local đã được khôi phục"
fi

# ── Step 4: Đảm bảo .htaccess có trong output ─────────────────
step 4 "Kiểm tra .htaccess (gzip + cache cho Apache/Plesk)"

if [ -f "${OUT_DIR}/.htaccess" ]; then
  ok ".htaccess đã có trong ${OUT_DIR}/"
elif [ -f "public/.htaccess" ]; then
  cp "public/.htaccess" "${OUT_DIR}/.htaccess"
  ok ".htaccess đã copy từ public/ → ${OUT_DIR}/"
else
  warn ".htaccess không tìm thấy — Plesk sẽ dùng config mặc định"
fi

# ── Step 5: Đóng gói ZIP ──────────────────────────────────────
step 5 "Đóng gói thành ${ZIP_NAME}"

[ -f "$ZIP_NAME" ] && rm "$ZIP_NAME"

# Đứng trong out/ để zip không tạo thư mục con khi extract
(
  cd "$OUT_DIR"
  zip -r "../${ZIP_NAME}" . \
    --exclude "*.DS_Store" \
    --exclude "__MACOSX/*" \
    -q
)

ZIP_ENTRIES=$(unzip -l "$ZIP_NAME" | tail -1 | awk '{print $2}')
[ "${ZIP_ENTRIES:-0}" -gt 0 ] 2>/dev/null || fail "ZIP rỗng — có lỗi khi đóng gói"

ZIP_SIZE=$(du -sh "$ZIP_NAME" | cut -f1)
OUT_SIZE=$(du -sh "$OUT_DIR"  | cut -f1)

ok "ZIP: ${BOLD}${ZIP_NAME}${NC} ${GREEN}(${ZIP_SIZE})${NC}"
dim "Thư mục out/: ${OUT_SIZE}  |  Số file: ${ZIP_ENTRIES}"

# ── Summary ───────────────────────────────────────────────────
echo ""
echo -e "${GREEN}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│  BUILD HOÀN TẤT                                      │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${BOLD}File để upload:${NC}  ${CYAN}${ZIP_NAME}${NC}  (${ZIP_SIZE})"
echo -e "  ${BOLD}Env đã dùng:${NC}    ${CYAN}${ENV_FILE}${NC}"
echo ""

echo -e "${BOLD}DEPLOY LÊN PLESK (MẮT BÃO):${NC}"
echo ""
echo -e "  ${CYAN}Bước 1${NC}  Đăng nhập Plesk Control Panel"
echo -e "  ${CYAN}Bước 2${NC}  Files → ${BOLD}httpdocs/${NC} → Upload ${BOLD}${ZIP_NAME}${NC}"
echo -e "  ${CYAN}Bước 3${NC}  Chuột phải vào file ZIP → ${BOLD}Extract Files${NC}"
echo -e "           ${DIM}Giải nén thẳng vào httpdocs/ — KHÔNG tạo subfolder${NC}"
echo -e "  ${CYAN}Bước 4${NC}  SSL/TLS → Let's Encrypt → ${BOLD}Issue Certificate${NC}"
echo -e "  ${CYAN}Bước 5${NC}  Mở trình duyệt: ${CYAN}https://yourdomain.cloud${NC}"
echo ""

if [ "$BUILD_MODE" != "production" ]; then
  echo -e "${YELLOW}Để build bản production:${NC}"
  echo -e "  ${DIM}cp .env.example .env.production${NC}"
  echo -e "  ${DIM}# Điền NEXT_PUBLIC_SIGNUP_ENDPOINT vào .env.production${NC}"
  echo -e "  ${DIM}bash build-deploy.sh --prod${NC}"
  echo ""
fi

echo -e "${DIM}Hoàn tất lúc $(date '+%H:%M:%S %d/%m/%Y')${NC}"
echo ""
