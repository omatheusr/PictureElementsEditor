# 🖼️ Picture Elements Visual Editor — Home Assistant Sidebar App

A dedicated **Left Sidebar Panel App** for Home Assistant that lets you visually design Picture Elements floorplan dashboards.

![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

---

## ⚡ Installation & Setup

### Step 1: Download via HACS

1. Open **HACS** in Home Assistant → Click the 3 dots (upper right) → **Custom repositories**.
2. Enter your repository URL (`https://github.com/your-username/PictureElementsEditor`).
3. Select Category: **Integration**.
4. Click **Download**.
5. **Restart Home Assistant**.

---

### Step 2: Add Integration in Home Assistant UI

1. Go to **Settings** → **Devices & Services** → Click **Add Integration** (bottom right).
2. Search for **"Picture Elements Visual Editor"**.
3. Click **Submit**.

**"Floorplan Editor"** will instantly appear in your main Home Assistant left navigation bar (`/picture-elements-editor`)!

---

## ✨ Features

- 🖼️ **Full-Screen Sidebar App**: Runs full-height (`100vh`) with a native sidebar toggle (`☰`) in the header.
- 🎯 **Visual Drag-and-Drop**: Drag elements across your floorplan image with percentage-based responsive snapping.
- 🎨 **Appearance, Color & Transparency Controls**:
  - Color pickers & RGBA background transparency (`rgba(0, 0, 0, 0.6)`)
  - Opacity slider (`0.0` - `1.0`)
  - Box Model: `width`, `height`, `padding`, `border`, `border-radius`, `box-shadow`
  - Typography: `font-size`, `font-weight`, `text-align`, `letter-spacing`
  - Filters & Effects: `filter` (`brightness`, `grayscale`, `blur`) and `backdrop-filter`
  - **Custom CSS Rules**: Add/edit/remove any arbitrary CSS key-value pair.
- ❓ **Inline Documentation Tooltips (`?`)**: Help buttons next to every property explaining usage and examples.
- 🔄 **Live 2-Way YAML Sync**: Instantly switch between the visual canvas and raw YAML code.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
