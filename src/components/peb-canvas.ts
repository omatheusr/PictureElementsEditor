import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PictureElementConfig, HomeAssistant } from '../types';
import { computeStyleString, getEntityIcon, formatEntityState, getEntityName } from '../utils/ha-helpers';

@customElement('peb-canvas')
export class PebCanvas extends LitElement {
  @property({ type: String }) image = '';
  @property({ type: Array }) elements: PictureElementConfig[] = [];
  @property({ type: Number }) selectedIndex = -1;
  @property({ type: Object }) hass?: HomeAssistant;

  @state() private isDragging = false;
  @state() private dragIndex = -1;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialTopPct = 50;
  private initialLeftPct = 50;

  static styles = css`
    :host {
      display: flex;
      flex: 1;
      height: 100%;
      position: relative;
      background: #121214;
      overflow: auto;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      user-select: none;
    }

    .canvas-wrapper {
      position: relative;
      display: inline-block;
      max-width: 100%;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #1c1c1e;
    }

    .background-img {
      display: block;
      max-width: 100%;
      height: auto;
      pointer-events: none;
    }

    .element-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: move;
      padding: 6px;
      border-radius: 6px;
      transition: box-shadow 0.15s, border-color 0.15s;
      border: 2px dashed transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .element-wrapper:hover {
      border-color: rgba(3, 169, 244, 0.6);
    }

    .element-wrapper.selected {
      border-color: #03a9f4;
      background: rgba(3, 169, 244, 0.15);
      box-shadow: 0 0 12px rgba(3, 169, 244, 0.5);
      z-index: 100;
    }

    .badge-preview {
      background: var(--ha-card-background, #2c2c2e);
      border-radius: 16px;
      padding: 4px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      font-size: 12px;
      color: #ffffff;
    }

    .icon-preview {
      font-size: 24px;
      color: var(--state-icon-color, #ffc107);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label-preview {
      font-size: 13px;
      color: #ffffff;
      font-weight: 500;
    }

    .button-preview {
      padding: 6px 12px;
      background: #03a9f4;
      color: #ffffff;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
    }

    .image-preview {
      max-width: 120px;
      border-radius: 4px;
    }

    .element-tag {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      background: #03a9f4;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
      pointer-events: none;
    }
  `;

  private _onMouseDown(e: MouseEvent, index: number) {
    e.stopPropagation();
    this.selectedIndex = index;
    this.isDragging = true;
    this.dragIndex = index;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;

    const el = this.elements[index];
    const topStr = String(el.style?.top || '50%');
    const leftStr = String(el.style?.left || '50%');

    this.initialTopPct = parseFloat(topStr.replace('%', '')) || 50;
    this.initialLeftPct = parseFloat(leftStr.replace('%', '')) || 50;

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);

    this.dispatchEvent(
      new CustomEvent('element-selected', {
        detail: { index },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging || this.dragIndex < 0) return;

    const wrapper = this.shadowRoot?.querySelector('.canvas-wrapper') as HTMLElement;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;

    const deltaLeftPct = (deltaX / rect.width) * 100;
    const deltaTopPct = (deltaY / rect.height) * 100;

    let newLeftPct = Math.min(Math.max(this.initialLeftPct + deltaLeftPct, 0), 100);
    let newTopPct = Math.min(Math.max(this.initialTopPct + deltaTopPct, 0), 100);

    newLeftPct = Math.round(newLeftPct * 10) / 10;
    newTopPct = Math.round(newTopPct * 10) / 10;

    const updatedElements = [...this.elements];
    const targetEl = JSON.parse(JSON.stringify(updatedElements[this.dragIndex]));

    if (!targetEl.style) targetEl.style = {};
    targetEl.style.top = `${newTopPct}%`;
    targetEl.style.left = `${newLeftPct}%`;

    updatedElements[this.dragIndex] = targetEl;

    this.dispatchEvent(
      new CustomEvent('elements-moved', {
        detail: { elements: updatedElements, index: this.dragIndex },
        bubbles: true,
        composed: true,
      })
    );
  };

  private _onMouseUp = () => {
    this.isDragging = false;
    this.dragIndex = -1;
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
  };

  private _renderElementContent(el: PictureElementConfig) {
    const entityId = el.entity || '';
    const stateVal = formatEntityState(entityId, this.hass);
    const iconName = el.icon || getEntityIcon(entityId, this.hass);

    switch (el.type) {
      case 'state-badge':
        return html`
          <div class="badge-preview">
            <span>🔹</span>
            <span>${entityId ? getEntityName(entityId, this.hass) : 'Badge'}: <strong>${stateVal}</strong></span>
          </div>
        `;
      case 'state-icon':
      case 'icon':
        return html`
          <div class="icon-preview" title="${entityId}">
            💡 <span>${entityId ? stateVal : iconName}</span>
          </div>
        `;
      case 'state-label':
        return html`
          <div class="label-preview">
            ${el.prefix || ''}${entityId ? stateVal : 'Label text'}${el.suffix || ''}
          </div>
        `;
      case 'action-button':
      case 'service-button':
        return html`
          <div class="button-preview">
            ${el.title || 'Button'}
          </div>
        `;
      case 'image':
        return html`
          <img class="image-preview" src="${el.image || 'https://via.placeholder.com/100'}" alt="Overlay" />
        `;
      default:
        return html`<div class="label-preview">${el.type || 'Element'}</div>`;
    }
  }

  render() {
    return html`
      <div class="canvas-wrapper">
        <img
          class="background-img"
          src="${this.image || 'https://demo.home-assistant.io/stub_config/floorplan.png'}"
          alt="Floorplan Background"
        />
        ${this.elements.map((el, index) => {
          const isSelected = index === this.selectedIndex;
          const styleAttr = computeStyleString(el.style);
          return html`
            <div
              class="element-wrapper ${isSelected ? 'selected' : ''}"
              style="${styleAttr}"
              @mousedown=${(e: MouseEvent) => this._onMouseDown(e, index)}
            >
              ${isSelected ? html`<span class="element-tag">#${index + 1} ${el.type}</span>` : ''}
              ${this._renderElementContent(el)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
