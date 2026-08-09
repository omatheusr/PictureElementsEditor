import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('peb-image-selector')
export class PebImageSelector extends LitElement {
  @property({ type: String }) value = '';

  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color, #aaaaaa);
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

    .quick-paths {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .path-chip {
      font-size: 11px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--secondary-text-color, #cccccc);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .path-chip:hover {
      background: rgba(3, 169, 244, 0.2);
      color: #ffffff;
    }
  `;

  private _onInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this._updateValue(target.value);
  }

  private _setQuickPath(path: string) {
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
        <label>Background Image URL / Local Path</label>
        <div class="input-row">
          <input
            type="text"
            .value=${this.value || ''}
            placeholder="/local/floorplan.png or https://..."
            @input=${this._onInputChange}
          />
        </div>
        <div class="quick-paths">
          <span class="path-chip" @click=${() => this._setQuickPath('/local/floorplan.png')}>
            /local/floorplan.png
          </span>
          <span class="path-chip" @click=${() => this._setQuickPath('https://demo.home-assistant.io/stub_config/floorplan.png')}>
            HA Stub Floorplan
          </span>
        </div>
      </div>
    `;
  }
}
