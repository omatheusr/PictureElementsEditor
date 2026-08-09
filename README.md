# 🖼️ Picture Elements Visual Editor — Home Assistant Sidebar App

A dedicated **Left Sidebar Panel App** for Home Assistant that lets you visually design Picture Elements floorplan dashboards.

![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

---

## ⚡ Automatic Sidebar Installation (Like Terminal / HACS)

Installing **Picture Elements Visual Editor** adds **"Floorplan Editor"** directly to your Home Assistant left sidebar navigator automatically — no YAML configuration required.

### Simple Installation Steps

1. Copy the `custom_components/picture_elements_editor` folder to your Home Assistant `/config/custom_components/` directory:

```text
/config/custom_components/picture_elements_editor/
├── __init__.py
├── manifest.json
└── www/
    └── picture-elements-editor.js
```

2. **Restart Home Assistant**.

That's it! **"Floorplan Editor"** will automatically appear in your Home Assistant left navigation bar (`/picture-elements-editor`).

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

## 💻 Development & Building

```bash
# Install dependencies
npm install

# Build production bundle
npm run build
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
