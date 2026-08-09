import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PresetElement } from '../types';

@customElement('peb-palette')
export class PebPalette extends LitElement {
  @property({ type: Boolean }) open = false;

  static styles = css`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-in-out;
    }

    .modal-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-card {
      background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
      color: var(--primary-text-color, #ffffff);
      border-radius: 12px;
      width: 90%;
      max-width: 640px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      overflow: hidden;
    }

    .modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--secondary-text-color, #aaaaaa);
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .close-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    .preset-grid {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 12px;
      overflow-y: auto;
    }

    .preset-card {
      background: var(--primary-background-color, #2c2c2e);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
      border-radius: 8px;
      padding: 14px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .preset-card:hover {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(3, 169, 244, 0.08);
      transform: translateY(-2px);
    }

    .preset-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #ffffff);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .preset-desc {
      font-size: 12px;
      color: var(--secondary-text-color, #aaaaaa);
      line-height: 1.4;
    }
  `;

  private presets: PresetElement[] = [
    {
      label: 'State Badge',
      description: 'Displays a standard Home Assistant badge showing real-time entity state and icon.',
      icon: 'badge',
      config: {
        type: 'state-badge',
        entity: 'sensor.temperature',
        style: { top: '50%', left: '50%' },
      },
    },
    {
      label: 'State Icon',
      description: 'Interactive icon reflecting state colors (lights, switches, sensors) with tap action.',
      icon: 'lightbulb',
      config: {
        type: 'state-icon',
        entity: 'light.living_room',
        style: { top: '50%', left: '50%' },
        tap_action: { action: 'toggle' },
      },
    },
    {
      label: 'State Label',
      description: 'Custom text label displaying string values, prefix, or suffix.',
      icon: 'label',
      config: {
        type: 'state-label',
        entity: 'sensor.humidity',
        prefix: 'Humidity: ',
        style: {
          top: '50%',
          left: '50%',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '13px',
        },
      },
    },
    {
      label: 'Action Button',
      description: 'Clickable action button that can perform any Home Assistant action or service.',
      icon: 'button',
      config: {
        type: 'action-button',
        title: 'Turn On All Lights',
        action: 'light.turn_on',
        style: {
          top: '50%',
          left: '50%',
          backgroundColor: '#03a9f4',
          color: '#ffffff',
          borderRadius: '6px',
        },
      },
    },
    {
      label: 'Static Icon',
      description: 'Custom icon overlay (e.g. mdi:fan, mdi:camera) with custom styling or tap action.',
      icon: 'icon',
      config: {
        type: 'icon',
        icon: 'mdi:home',
        style: { top: '50%', left: '50%', color: '#ffffff' },
        tap_action: { action: 'more-info' },
      },
    },
    {
      label: 'Overlay Image',
      description: 'Overlay image or dynamic state-based image (e.g. floorplan lighting layer).',
      icon: 'image',
      config: {
        type: 'image',
        entity: 'light.kitchen',
        image: '/local/floorplan_light_layer.png',
        style: { top: '50%', left: '50%', width: '100%' },
      },
    },
    {
      label: 'Conditional Element',
      description: 'Displays child elements only when entity state condition rules pass.',
      icon: 'filter',
      config: {
        type: 'conditional',
        conditions: [
          { entity: 'binary_sensor.motion', state: 'on' },
        ],
        elements: [
          {
            type: 'state-icon',
            entity: 'binary_sensor.motion',
            style: { top: '50%', left: '50%', color: '#ff9800' },
          },
        ],
      },
    },
  ];

  private _selectPreset(preset: PresetElement) {
    this.dispatchEvent(
      new CustomEvent('add-element', {
        detail: { config: JSON.parse(JSON.stringify(preset.config)) },
        bubbles: true,
        composed: true,
      })
    );
    this.open = false;
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="modal-overlay ${this.open ? 'open' : ''}">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Add Picture Element</h3>
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>
          <div class="preset-grid">
            ${this.presets.map(
              (p) => html`
                <div class="preset-card" @click=${() => this._selectPreset(p)}>
                  <div class="preset-title">
                    <span>${p.label}</span>
                  </div>
                  <div class="preset-desc">${p.description}</div>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }
}
