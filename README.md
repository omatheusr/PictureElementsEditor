# 🖼️ Picture Elements Visual Editor for Home Assistant

A modern, interactive drag-and-drop visual editor plugin for Home Assistant Picture Elements dashboards.

![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

- 🎯 **Interactive Visual Drag-and-Drop**: Drag elements directly onto your floorplan image with percentage-based responsive snapping (`top: 45%`, `left: 62%`).
- ➕ **Element Palette Modal**: Add native Picture Element presets (`state-badge`, `state-icon`, `state-label`, `service-button`, `icon`, `image`, `conditional`) in 1 click.
- 🛠️ **Inspector Sidebar**: Edit position, entity bindings, icons, custom CSS styles, tap/hold actions, service calls, and prefixes/suffixes with live feedback.
- ⚡ **Live HA State Binding**: Autocomplete entity IDs from your Home Assistant state machine and preview state icons and values in real time.
- 🔄 **Bidirectional Live YAML Sync**: Switch instantly between the visual canvas and raw YAML code editor with a copy-to-clipboard shortcut.
- 🖼️ **Image Selector**: Configure local `/local/floorplan.png` background images or remote URLs easily.

---

## 📦 Installation via HACS

1. Open **HACS** in your Home Assistant instance.
2. Click **Frontend** → Three dots upper right → **Custom repositories**.
3. Add repository URL: `https://github.com/your-username/PictureElementsEditor`
4. Category: **Lovelace**.
5. Click **Download** and reload your browser cache (`Ctrl + Shift + R`).

---

## 🚀 Quickstart Dashboard Configuration

Add this custom card directly to your Home Assistant dashboard configuration:

```yaml
type: custom:picture-elements-editor
title: "My Floorplan Editor"
image: "/local/floorplan.png"
elements:
  - type: state-badge
    entity: sensor.temperature
    style:
      top: 32%
      left: 40%
  - type: state-icon
    entity: light.living_room
    style:
      top: 50%
      left: 50%
    tap_action:
      action: toggle
  - type: state-label
    entity: sensor.humidity
    prefix: "Humidity: "
    style:
      top: 70%
      left: 30%
      color: white
      backgroundColor: "rgba(0, 0, 0, 0.5)"
      padding: "4px 8px"
      borderRadius: "4px"
```

---

## 💻 Local Development & Building

### Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Build Steps

```bash
# 1. Install dependencies
npm install

# 2. Build production bundle (outputs dist/picture-elements-editor.js)
npm run build

# 3. Development watch mode
npm run watch
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
