import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PictureElementConfig, PictureElementsCardConfig, HomeAssistant, ConditionRule } from '../types';
import { getEntityList } from '../utils/ha-helpers';

@customElement('peb-sidebar')
export class PebSidebar extends LitElement {
  @property({ type: Object }) cardConfig: PictureElementsCardConfig | null = null;
  @property({ type: Object }) element: PictureElementConfig | null = null;
  @property({ type: Number }) selectedIndex = -1;
  @property({ type: Object }) hass?: HomeAssistant;

  @state() private activeTooltip: string | null = null;
  @state() private activeActionTab: 'tap_action' | 'hold_action' | 'double_tap_action' = 'tap_action';

  static styles = css`
    :host {
      display: block;
      width: 360px;
      background: var(--card-background-color, #1c1c1e);
      border-left: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      color: var(--primary-text-color, #ffffff);
      overflow-y: auto;
      height: 100%;
      box-sizing: border-box;
    }

    .sidebar-inner {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      padding-bottom: 12px;
    }

    .sidebar-header h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
    }

    .delete-btn {
      background: rgba(244, 67, 54, 0.15);
      color: #f44336;
      border: 1px solid rgba(244, 67, 54, 0.3);
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.15s;
    }

    .delete-btn:hover {
      background: #f44336;
      color: #ffffff;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(255, 255, 255, 0.03);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--primary-color, #03a9f4);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
    }

    .label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    label {
      font-size: 12px;
      color: var(--secondary-text-color, #cccccc);
      font-weight: 500;
    }

    .help-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #aaaaaa;
      border: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .help-btn:hover {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
    }

    .tooltip-box {
      background: #2a2a2d;
      color: #e0e0e0;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      padding: 10px;
      font-size: 11px;
      line-height: 1.4;
      margin-top: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    input[type='text'],
    input[type='number'],
    textarea,
    select {
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      background: var(--primary-background-color, #2c2c2e);
      color: var(--primary-text-color, #ffffff);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      font-size: 13px;
      box-sizing: border-box;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      cursor: pointer;
    }

    .checkbox-row input {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .action-tabs {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      padding: 2px;
      border-radius: 6px;
      gap: 2px;
    }

    .action-tab-btn {
      flex: 1;
      padding: 5px 2px;
      font-size: 10px;
      font-weight: 600;
      background: none;
      border: none;
      color: #aaaaaa;
      cursor: pointer;
      border-radius: 4px;
      text-align: center;
    }

    .action-tab-btn.active {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
    }

    .condition-card {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .btn-small {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      align-self: flex-start;
    }

    .btn-small:hover {
      background: var(--primary-color, #03a9f4);
    }
  `;

  private _toggleHelp(key: string) {
    this.activeTooltip = this.activeTooltip === key ? null : key;
  }

  private _renderHelpBtn(key: string, docText: string) {
    const isOpen = this.activeTooltip === key;
    return html`
      <button
        class="help-btn"
        title="Show help hint"
        @click=${() => this._toggleHelp(key)}
      >
        ?
      </button>
      ${isOpen ? html`<div class="tooltip-box">${docText}</div>` : ''}
    `;
  }

  // --- Element Updates ---
  private _updateElementField(field: string, value: any) {
    if (!this.element) return;
    const updated = JSON.parse(JSON.stringify(this.element));
    if (value === '' || value === null) {
      delete updated[field];
    } else {
      updated[field] = value;
    }
    this._dispatchElementUpdate(updated);
  }

  private _updateStyle(propertyKey: string, value: string) {
    if (!this.element) return;
    const updated = JSON.parse(JSON.stringify(this.element));
    if (!updated.style) updated.style = {};
    if (value === '') {
      delete updated.style[propertyKey];
    } else {
      updated.style[propertyKey] = value;
    }
    this._dispatchElementUpdate(updated);
  }

  private _updateAction(
    actionType: 'tap_action' | 'hold_action' | 'double_tap_action',
    field: string,
    value: any
  ) {
    if (!this.element) return;
    const updated = JSON.parse(JSON.stringify(this.element));
    if (!updated[actionType]) updated[actionType] = { action: 'more-info' };
    if (value === '' || value === null) {
      delete updated[actionType][field];
    } else {
      updated[actionType][field] = value;
    }
    this._dispatchElementUpdate(updated);
  }

  // --- Conditions for Conditional Element ---
  private _addCondition() {
    if (!this.element) return;
    const updated = JSON.parse(JSON.stringify(this.element));
    if (!updated.conditions) updated.conditions = [];
    updated.conditions.push({ entity: '', state: 'on' });
    this._dispatchElementUpdate(updated);
  }

  private _updateCondition(index: number, field: keyof ConditionRule, value: string) {
    if (!this.element || !this.element.conditions) return;
    const updated = JSON.parse(JSON.stringify(this.element));
    if (value === '') {
      delete updated.conditions[index][field];
    } else {
      updated.conditions[index][field] = value;
    }
    this._dispatchElementUpdate(updated);
  }

  private _deleteCondition(index: number) {
    if (!this.element || !this.element.conditions) return;
    const updated = JSON.parse(JSON.stringify(this.element));
    updated.conditions.splice(index, 1);
    this._dispatchElementUpdate(updated);
  }

  private _dispatchElementUpdate(updatedElement: PictureElementConfig) {
    this.dispatchEvent(
      new CustomEvent('element-updated', {
        detail: { index: this.selectedIndex, config: updatedElement },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _deleteElement() {
    this.dispatchEvent(
      new CustomEvent('element-deleted', {
        detail: { index: this.selectedIndex },
        bubbles: true,
        composed: true,
      })
    );
  }

  // --- Card Config Updates ---
  private _updateCardField(field: string, value: any) {
    if (!this.cardConfig) return;
    const updated = { ...this.cardConfig, [field]: value };
    this.dispatchEvent(
      new CustomEvent('card-config-updated', {
        detail: { config: updated },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const entityList = getEntityList(this.hass);

    // Render Card-Level Settings when no element is selected
    if (!this.element || this.selectedIndex < 0) {
      const card = this.cardConfig || { type: 'picture-elements', elements: [] };
      return html`
        <div class="sidebar-inner">
          <div class="sidebar-header">
            <h3>Card Configuration</h3>
          </div>

          <div class="section">
            <div class="section-title">
              <span>Card Settings</span>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Card Title</label>
                ${this._renderHelpBtn(
                  'card-title',
                  'Optional title string displayed at the top of the card.'
                )}
              </div>
              <input
                type="text"
                .value=${card.title || ''}
                placeholder="My Floorplan"
                @input=${(e: Event) =>
                  this._updateCardField('title', (e.target as HTMLInputElement).value)}
              />
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Background Image URL</label>
                ${this._renderHelpBtn(
                  'card-image',
                  'URL of the main floorplan image. Supports /local/file.png or http/https links.'
                )}
              </div>
              <input
                type="text"
                .value=${card.image || ''}
                placeholder="/local/floorplan.png"
                @input=${(e: Event) =>
                  this._updateCardField('image', (e.target as HTMLInputElement).value)}
              />
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Image Entity</label>
                ${this._renderHelpBtn(
                  'card-image-entity',
                  'Image or person entity to display dynamically as background.'
                )}
              </div>
              <input
                type="text"
                list="entity-suggestions-card"
                .value=${card.image_entity || ''}
                placeholder="image.floorplan"
                @change=${(e: Event) =>
                  this._updateCardField('image_entity', (e.target as HTMLInputElement).value)}
              />
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Camera Image Entity</label>
                ${this._renderHelpBtn(
                  'card-camera-image',
                  'Camera entity to use for live background streaming.'
                )}
              </div>
              <input
                type="text"
                list="entity-suggestions-card"
                .value=${card.camera_image || ''}
                placeholder="camera.living_room"
                @change=${(e: Event) =>
                  this._updateCardField('camera_image', (e.target as HTMLInputElement).value)}
              />
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Camera View Mode</label>
                ${this._renderHelpBtn(
                  'card-camera-view',
                  'Set to "live" for continuous live view or "auto" for periodic snapshot.'
                )}
              </div>
              <select
                .value=${card.camera_view || 'auto'}
                @change=${(e: Event) =>
                  this._updateCardField('camera_view', (e.target as HTMLSelectElement).value)}
              >
                <option value="auto">auto</option>
                <option value="live">live</option>
              </select>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Dark Mode Image</label>
                ${this._renderHelpBtn(
                  'card-dark-mode-image',
                  'Image used when dark mode is activated.'
                )}
              </div>
              <input
                type="text"
                .value=${card.dark_mode_image || ''}
                placeholder="/local/floorplan_dark.png"
                @input=${(e: Event) =>
                  this._updateCardField('dark_mode_image', (e.target as HTMLInputElement).value)}
              />
            </div>

            <datalist id="entity-suggestions-card">
              ${entityList.map((ent) => html`<option value=${ent}></option>`)}
            </datalist>
          </div>
        </div>
      `;
    }

    const el = this.element;
    const style = el.style || {};
    const currentAction = el[this.activeActionTab] || { action: 'more-info' };

    return html`
      <div class="sidebar-inner">
        <div class="sidebar-header">
          <h3>Element #${this.selectedIndex + 1} (${el.type})</h3>
          <button class="delete-btn" @click=${this._deleteElement}>Delete</button>
        </div>

        <!-- General Configuration Section -->
        <div class="section">
          <div class="section-title">
            <span>General Config</span>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Element Type</label>
              ${this._renderHelpBtn(
                'el-type',
                'REQUIRED. The element type: state-badge, state-icon, state-label, action-button, icon, image, conditional, or custom:my-card.'
              )}
            </div>
            <select
              .value=${el.type || 'state-icon'}
              @change=${(e: Event) =>
                this._updateElementField('type', (e.target as HTMLSelectElement).value)}
            >
              <option value="state-badge">state-badge</option>
              <option value="state-icon">state-icon</option>
              <option value="state-label">state-label</option>
              <option value="action-button">action-button</option>
              <option value="icon">icon</option>
              <option value="image">image</option>
              <option value="conditional">conditional</option>
            </select>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Entity ID</label>
              ${this._renderHelpBtn(
                'el-entity',
                'Entity ID to bind for state updates, badge values, or state-based styling.'
              )}
            </div>
            <input
              type="text"
              list="entity-suggestions"
              .value=${el.entity || ''}
              placeholder="light.living_room"
              @change=${(e: Event) =>
                this._updateElementField('entity', (e.target as HTMLInputElement).value)}
            />
            <datalist id="entity-suggestions">
              ${entityList.map((ent) => html`<option value=${ent}></option>`)}
            </datalist>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Title / Tooltip</label>
              ${this._renderHelpBtn(
                'el-title',
                'Hover tooltip text shown on the element. Set to null to hide.'
              )}
            </div>
            <input
              type="text"
              .value=${el.title || ''}
              placeholder="Living Room Light"
              @input=${(e: Event) =>
                this._updateElementField('title', (e.target as HTMLInputElement).value)}
            />
          </div>

          ${el.type === 'state-badge'
            ? html`
                <div class="form-group">
                  <div class="label-row">
                    <label>Name Override</label>
                    ${this._renderHelpBtn(
                      'badge-name',
                      'Alternative name displayed below badge. Defaults to entity name.'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.name || ''}
                    placeholder="Custom Badge Name"
                    @input=${(e: Event) =>
                      this._updateElementField('name', (e.target as HTMLInputElement).value)}
                  />
                </div>
              `
            : ''}

          ${el.type === 'state-icon' || el.type === 'icon'
            ? html`
                <div class="form-group">
                  <div class="label-row">
                    <label>Icon String</label>
                    ${this._renderHelpBtn(
                      'icon-str',
                      'Material Design Icon identifier, e.g. mdi:home or mdi:lightbulb.'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.icon || ''}
                    placeholder="mdi:lightbulb"
                    @input=${(e: Event) =>
                      this._updateElementField('icon', (e.target as HTMLInputElement).value)}
                  />
                </div>
                ${el.type === 'state-icon'
                  ? html`
                      <label class="checkbox-row">
                        <input
                          type="checkbox"
                          .checked=${el.state_color !== false}
                          @change=${(e: Event) =>
                            this._updateElementField(
                              'state_color',
                              (e.target as HTMLInputElement).checked
                            )}
                        />
                        State Color (Active Icon Coloring)
                      </label>
                    `
                  : ''}
              `
            : ''}

          ${el.type === 'state-label'
            ? html`
                <div class="form-group">
                  <div class="label-row">
                    <label>Attribute</label>
                    ${this._renderHelpBtn(
                      'label-attr',
                      'Show a specific entity attribute instead of state (e.g. current_temperature).'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.attribute || ''}
                    placeholder="current_temperature"
                    @input=${(e: Event) =>
                      this._updateElementField('attribute', (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <div class="label-row">
                      <label>Prefix</label>
                    </div>
                    <input
                      type="text"
                      .value=${el.prefix || ''}
                      placeholder="Temp: "
                      @input=${(e: Event) =>
                        this._updateElementField('prefix', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div class="form-group">
                    <div class="label-row">
                      <label>Suffix</label>
                    </div>
                    <input
                      type="text"
                      .value=${el.suffix || ''}
                      placeholder=" °C"
                      @input=${(e: Event) =>
                        this._updateElementField('suffix', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                </div>
              `
            : ''}

          ${el.type === 'action-button' || el.type === 'service-button'
            ? html`
                <div class="form-group">
                  <div class="label-row">
                    <label>Button Label</label>
                    ${this._renderHelpBtn(
                      'action-title',
                      'REQUIRED. Text displayed inside the action button.'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.title || ''}
                    placeholder="Turn On Lights"
                    @input=${(e: Event) =>
                      this._updateElementField('title', (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="form-group">
                  <div class="label-row">
                    <label>Action / Service</label>
                    ${this._renderHelpBtn(
                      'action-name',
                      'Service name to execute, e.g. light.turn_on or homeassistant.turn_off.'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.action || el.service || ''}
                    placeholder="light.turn_on"
                    @input=${(e: Event) => {
                      const val = (e.target as HTMLInputElement).value;
                      this._updateElementField('action', val);
                      this._updateElementField('service', val);
                    }}
                  />
                </div>
              `
            : ''}

          ${el.type === 'image'
            ? html`
                <div class="form-group">
                  <div class="label-row">
                    <label>Image Source</label>
                    ${this._renderHelpBtn(
                      'img-src',
                      'Image path, e.g. /local/living_room.png or URL.'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.image || ''}
                    placeholder="/local/living_room.png"
                    @input=${(e: Event) =>
                      this._updateElementField('image', (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="form-group">
                  <div class="label-row">
                    <label>Camera Image Entity</label>
                    ${this._renderHelpBtn(
                      'img-camera',
                      'Camera entity ID for live background snapshot.'
                    )}
                  </div>
                  <input
                    type="text"
                    .value=${el.camera_image || ''}
                    placeholder="camera.driveway"
                    @input=${(e: Event) =>
                      this._updateElementField('camera_image', (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <label>Filter CSS</label>
                    <input
                      type="text"
                      .value=${el.filter || ''}
                      placeholder="saturate(.8)"
                      @input=${(e: Event) =>
                        this._updateElementField('filter', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div class="form-group">
                    <label>Aspect Ratio</label>
                    <input
                      type="text"
                      .value=${el.aspect_ratio || ''}
                      placeholder="16:9 or 50%"
                      @input=${(e: Event) =>
                        this._updateElementField(
                          'aspect_ratio',
                          (e.target as HTMLInputElement).value
                        )}
                    />
                  </div>
                </div>
              `
            : ''}

          ${el.type === 'conditional'
            ? html`
                <div class="form-group">
                  <div class="label-row">
                    <label>Condition Rules</label>
                    ${this._renderHelpBtn(
                      'cond-rules',
                      'Rules that determine when child elements are rendered.'
                    )}
                  </div>
                  ${(el.conditions || []).map(
                    (cond, condIdx) => html`
                      <div class="condition-card">
                        <input
                          type="text"
                          list="entity-suggestions"
                          .value=${cond.entity || ''}
                          placeholder="sensor.motion"
                          @change=${(e: Event) =>
                            this._updateCondition(
                              condIdx,
                              'entity',
                              (e.target as HTMLInputElement).value
                            )}
                        />
                        <div class="grid-2">
                          <input
                            type="text"
                            .value=${cond.state || ''}
                            placeholder="State = on"
                            @input=${(e: Event) =>
                              this._updateCondition(
                                condIdx,
                                'state',
                                (e.target as HTMLInputElement).value
                              )}
                          />
                          <input
                            type="text"
                            .value=${cond.state_not || ''}
                            placeholder="State ≠ off"
                            @input=${(e: Event) =>
                              this._updateCondition(
                                condIdx,
                                'state_not',
                                (e.target as HTMLInputElement).value
                              )}
                          />
                        </div>
                        <button
                          class="btn-small"
                          style="color: #f44336;"
                          @click=${() => this._deleteCondition(condIdx)}
                        >
                          Remove Condition
                        </button>
                      </div>
                    `
                  )}
                  <button class="btn-small" @click=${this._addCondition}>
                    + Add Condition
                  </button>
                </div>
              `
            : ''}
        </div>

        <!-- Positioning Section -->
        <div class="section">
          <div class="section-title">
            <span>Positioning (% Relative)</span>
            ${this._renderHelpBtn(
              'pos-help',
              'Position elements using CSS top and left percentages (e.g., top: 50%, left: 50%). Default transform is translate(-50%, -50%).'
            )}
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Top</label>
              <input
                type="text"
                .value=${style.top || '50%'}
                placeholder="50%"
                @change=${(e: Event) =>
                  this._updateStyle('top', (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="form-group">
              <label>Left</label>
              <input
                type="text"
                .value=${style.left || '50%'}
                placeholder="50%"
                @change=${(e: Event) =>
                  this._updateStyle('left', (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
        </div>

        <!-- Action Triggers Section (Tap / Hold / Double Tap) -->
        <div class="section">
          <div class="section-title">
            <span>Actions Config</span>
            ${this._renderHelpBtn(
              'action-help',
              'Configure actions for Tap, Hold (0.5s hold), or Double Tap events.'
            )}
          </div>

          <div class="action-tabs">
            <button
              class="action-tab-btn ${this.activeActionTab === 'tap_action' ? 'active' : ''}"
              @click=${() => (this.activeActionTab = 'tap_action')}
            >
              Tap
            </button>
            <button
              class="action-tab-btn ${this.activeActionTab === 'hold_action' ? 'active' : ''}"
              @click=${() => (this.activeActionTab = 'hold_action')}
            >
              Hold
            </button>
            <button
              class="action-tab-btn ${this.activeActionTab === 'double_tap_action' ? 'active' : ''}"
              @click=${() => (this.activeActionTab = 'double_tap_action')}
            >
              Double Tap
            </button>
          </div>

          <div class="form-group">
            <select
              .value=${currentAction.action || 'more-info'}
              @change=${(e: Event) =>
                this._updateAction(
                  this.activeActionTab,
                  'action',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="more-info">more-info</option>
              <option value="toggle">toggle</option>
              <option value="perform-action">perform-action</option>
              <option value="navigate">navigate</option>
              <option value="url">url</option>
              <option value="none">none</option>
            </select>
          </div>

          ${currentAction.action === 'navigate'
            ? html`
                <div class="form-group">
                  <label>Navigation Path</label>
                  <input
                    type="text"
                    .value=${currentAction.navigation_path || ''}
                    placeholder="/lovelace/living-room"
                    @input=${(e: Event) =>
                      this._updateAction(
                        this.activeActionTab,
                        'navigation_path',
                        (e.target as HTMLInputElement).value
                      )}
                  />
                </div>
              `
            : ''}

          ${currentAction.action === 'perform-action' || currentAction.action === 'call-service'
            ? html`
                <div class="form-group">
                  <label>Perform Action / Service</label>
                  <input
                    type="text"
                    .value=${currentAction.perform_action || currentAction.service || ''}
                    placeholder="light.turn_on"
                    @input=${(e: Event) => {
                      const val = (e.target as HTMLInputElement).value;
                      this._updateAction(this.activeActionTab, 'perform_action', val);
                      this._updateAction(this.activeActionTab, 'service', val);
                    }}
                  />
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}
