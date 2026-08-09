import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  PictureElementsCardConfig,
  PictureElementConfig,
  HomeAssistant,
  PanelInfo,
} from './types';
import { createDefaultConfig } from './utils/yaml-helpers';

// Register custom subcomponents
import './components/peb-canvas';
import './components/peb-sidebar';
import './components/peb-palette';
import './components/peb-yaml-editor';
import './components/peb-image-selector';

@customElement('picture-elements-editor')
export class PictureElementsEditor extends LitElement {
  @property({ type: Object }) public hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) public isPanel = false;

  @state() private config: PictureElementsCardConfig = createDefaultConfig();
  @state() private selectedIndex = -1;
  @state() private activeTab: 'visual' | 'yaml' = 'visual';
  @state() private isPaletteOpen = false;

  public setConfig(config: PictureElementsCardConfig): void {
    if (!config || !Array.isArray(config.elements)) {
      this.config = createDefaultConfig();
    } else {
      this.config = JSON.parse(JSON.stringify(config));
    }
  }

  public getCardSize(): number {
    return 6;
  }

  public static getStubConfig(): PictureElementsCardConfig {
    return createDefaultConfig();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 720px;
      background: var(--ha-card-background, #1c1c1e);
      border-radius: 12px;
      overflow: hidden;
      color: var(--primary-text-color, #ffffff);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
    }

    :host([ispanel]) {
      border-radius: 0;
      border: none;
      height: 100vh;
      width: 100%;
    }

    .header-bar {
      height: 56px;
      background: #242426;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      box-sizing: border-box;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar-menu-btn {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 20px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-menu-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .title-group h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
    }

    .tabs {
      display: flex;
      background: #141416;
      padding: 3px;
      border-radius: 8px;
    }

    .tab-btn {
      padding: 6px 14px;
      border-radius: 6px;
      border: none;
      background: none;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .tab-btn.active {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
    }

    .actions-group {
      display: flex;
      gap: 10px;
    }

    .btn-add {
      background: #03a9f4;
      color: #ffffff;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }

    .btn-add:hover {
      background: #0288d1;
    }

    .main-content {
      flex: 1;
      display: flex;
      overflow: hidden;
      position: relative;
    }

    .canvas-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .toolbar-sub {
      padding: 10px 16px;
      background: #1e1e20;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
  `;

  private _toggleHASidebar() {
    this.dispatchEvent(
      new CustomEvent('hass-toggle-menu', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onImageChanged(e: CustomEvent) {
    this.config = {
      ...this.config,
      image: e.detail.value,
    };
    this._fireConfigChanged();
  }

  private _onElementSelected(e: CustomEvent) {
    this.selectedIndex = e.detail.index;
  }

  private _onElementsMoved(e: CustomEvent) {
    this.config = {
      ...this.config,
      elements: e.detail.elements,
    };
    this._fireConfigChanged();
  }

  private _onElementUpdated(e: CustomEvent) {
    const { index, config } = e.detail;
    const updatedElements = [...this.config.elements];
    updatedElements[index] = config;

    this.config = {
      ...this.config,
      elements: updatedElements,
    };
    this._fireConfigChanged();
  }

  private _onCardConfigUpdated(e: CustomEvent) {
    this.config = e.detail.config;
    this._fireConfigChanged();
  }

  private _onElementDeleted(e: CustomEvent) {
    const { index } = e.detail;
    const updatedElements = this.config.elements.filter((_, i) => i !== index);

    this.config = {
      ...this.config,
      elements: updatedElements,
    };
    this.selectedIndex = -1;
    this._fireConfigChanged();
  }

  private _onAddElement(e: CustomEvent) {
    const newEl: PictureElementConfig = e.detail.config;
    const updatedElements = [...this.config.elements, newEl];

    this.config = {
      ...this.config,
      elements: updatedElements,
    };
    this.selectedIndex = updatedElements.length - 1;
    this._fireConfigChanged();
  }

  private _onConfigFromYaml(e: CustomEvent) {
    this.config = e.detail.config;
    this.selectedIndex = -1;
    this._fireConfigChanged();
  }

  private _fireConfigChanged() {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const selectedEl =
      this.selectedIndex >= 0 && this.selectedIndex < this.config.elements.length
        ? this.config.elements[this.selectedIndex]
        : null;

    return html`
      <div class="header-bar">
        <div class="title-group">
          ${this.isPanel
            ? html`
                <button
                  class="sidebar-menu-btn"
                  title="Toggle Home Assistant Menu"
                  @click=${this._toggleHASidebar}
                >
                  ☰
                </button>
              `
            : ''}
          <h2>🖼️ Picture Elements Visual Editor</h2>
          <div class="tabs">
            <button
              class="tab-btn ${this.activeTab === 'visual' ? 'active' : ''}"
              @click=${() => (this.activeTab = 'visual')}
            >
              Visual Editor
            </button>
            <button
              class="tab-btn ${this.activeTab === 'yaml' ? 'active' : ''}"
              @click=${() => (this.activeTab = 'yaml')}
            >
              YAML Code
            </button>
          </div>
        </div>

        <div class="actions-group">
          ${this.activeTab === 'visual'
            ? html`
                <button class="btn-add" @click=${() => (this.isPaletteOpen = true)}>
                  ➕ Add Element
                </button>
              `
            : ''}
        </div>
      </div>

      <div class="main-content">
        ${this.activeTab === 'visual'
          ? html`
              <div class="canvas-section">
                <div class="toolbar-sub">
                  <peb-image-selector
                    .value=${this.config.image || ''}
                    @image-changed=${this._onImageChanged}
                  ></peb-image-selector>
                </div>
                <peb-canvas
                  .image=${this.config.image || ''}
                  .elements=${this.config.elements || []}
                  .selectedIndex=${this.selectedIndex}
                  .hass=${this.hass}
                  @element-selected=${this._onElementSelected}
                  @elements-moved=${this._onElementsMoved}
                ></peb-canvas>
              </div>

              <peb-sidebar
                .cardConfig=${this.config}
                .element=${selectedEl}
                .selectedIndex=${this.selectedIndex}
                .hass=${this.hass}
                @element-updated=${this._onElementUpdated}
                @card-config-updated=${this._onCardConfigUpdated}
                @element-deleted=${this._onElementDeleted}
              ></peb-sidebar>

              <peb-palette
                .open=${this.isPaletteOpen}
                @add-element=${this._onAddElement}
                @close=${() => (this.isPaletteOpen = false)}
              ></peb-palette>
            `
          : html`
              <peb-yaml-editor
                .config=${this.config}
                @config-updated=${this._onConfigFromYaml}
              ></peb-yaml-editor>
            `}
      </div>
    `;
  }
}

// Register as Home Assistant Main Left Sidebar Panel (<ha-panel-picture-elements-editor>)
@customElement('ha-panel-picture-elements-editor')
export class HaPanelPictureElementsEditor extends LitElement {
  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ type: Object }) public panel!: PanelInfo;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      background: var(--primary-background-color, #121214);
      overflow: hidden;
      box-sizing: border-box;
    }
  `;

  render() {
    return html`
      <picture-elements-editor
        .hass=${this.hass}
        .isPanel=${true}
        ispanel
      ></picture-elements-editor>
    `;
  }
}

// Register window custom card object for HA Lovelace picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'picture-elements-editor',
  name: 'Picture Elements Visual Editor',
  description: 'Interactive visual drag-and-drop editor for Home Assistant Picture Elements floorplans.',
});
