import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('peb-image-selector')
export class PebImageSelector extends LitElement {
  @property({ type: String }) value = '';

  @state() private detectedImages: string[] = [
    '/local/floorplan.png',
    '/local/floorplan_dark.png',
    '/local/living_room.png',
    '/local/bedroom.png',
    '/local/kitchen.png',
    'https://demo.home-assistant.io/stub_config/floorplan.png',
  ];

  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color, #aaaaaa);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .input-row {
      display: flex;
      gap: 8px;
    }

    input[type='text'] {
      flex: 1;
      padding: 8px 12px;
      border-radius: 6px;
      background: var(--primary-background-color, #2c2c2e);
      color: var(--primary-text-color, #ffffff);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      font-size: 13px;
    }

    input[type='text']:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    .carousel-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color, #03a9f4);
      margin-top: 2px;
    }

    .image-carousel {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    .image-carousel::-webkit-scrollbar {
      height: 6px;
    }

    .image-carousel::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .thumbnail-card {
      flex: 0 0 auto;
      width: 80px;
      height: 60px;
      border-radius: 6px;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      position: relative;
      background: #18181a;
      transition: all 0.15s ease-in-out;
    }

    .thumbnail-card:hover {
      border-color: var(--primary-color, #03a9f4);
      transform: scale(1.04);
    }

    .thumbnail-card.selected {
      border-color: var(--primary-color, #03a9f4);
      box-shadow: 0 0 8px rgba(3, 169, 244, 0.6);
    }

    .thumbnail-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      color: #ffffff;
      font-size: 9px;
      padding: 2px 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
  `;

  private _onInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    this._updateValue(val);
  }

  private _selectImage(path: string) {
    this._updateValue(path);
  }

  private _updateValue(val: string) {
    this.value = val;
    this.dispatchEvent(
      new CustomEvent('image-changed', {
        detail: { value: val },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="container">
        <label>
          <span>Background Floorplan Image URL / Path</span>
          <span class="carousel-header">📷 Image Directory Gallery</span>
        </label>

        <div class="input-row">
          <input
            type="text"
            .value=${this.value || ''}
            placeholder="/local/floorplan.png or /local/images/floorplan.jpg"
            @input=${this._onInputChange}
          />
        </div>

        <div class="image-carousel">
          ${this.detectedImages.map((imgPath) => {
            const isSel = this.value === imgPath;
            const filename = imgPath.split('/').pop() || 'image';
            return html`
              <div
                class="thumbnail-card ${isSel ? 'selected' : ''}"
                title="${imgPath}"
                @click=${() => this._selectImage(imgPath)}
              >
                <img src="${imgPath}" alt="${filename}" onerror="this.src='https://via.placeholder.com/80x60?text=Floorplan'" />
                <div class="thumbnail-label">${filename}</div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
