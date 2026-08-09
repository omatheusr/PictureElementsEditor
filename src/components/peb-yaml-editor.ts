import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PictureElementsCardConfig } from '../types';
import { objectToYaml, yamlToObject } from '../utils/yaml-helpers';

@customElement('peb-yaml-editor')
export class PebYamlEditor extends LitElement {
  @property({ type: Object }) config!: PictureElementsCardConfig;

  @state() private yamlText = '';
  @state() private error = '';
  @state() private copied = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #18181a;
      color: #ffffff;
      box-sizing: border-box;
    }

    .toolbar {
      padding: 10px 16px;
      background: #222225;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .toolbar-title {
      font-size: 13px;
      font-weight: 600;
      color: #cccccc;
    }

    .btn-group {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease-in-out;
    }

    .btn-apply {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
    }

    .btn-apply:hover {
      background: #0288d1;
    }

    .btn-copy {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .btn-copy:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .editor-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px;
      overflow: hidden;
    }

    textarea {
      flex: 1;
      width: 100%;
      background: #121214;
      color: #76e2ef;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px;
      font-family: 'Fira Code', 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
      resize: none;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    .error-banner {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
      border: 1px solid #f44336;
      padding: 8px 12px;
      margin-top: 8px;
      border-radius: 6px;
      font-size: 12px;
    }
  `;

  updated(changedProps: Map<string, any>) {
    if (changedProps.has('config') && this.config) {
      this.yamlText = objectToYaml(this.config);
      this.error = '';
    }
  }

  private _onYamlInput(e: Event) {
    this.yamlText = (e.target as HTMLTextAreaElement).value;
  }

  private _applyYaml() {
    const parsed = yamlToObject(this.yamlText);
    if (!parsed) {
      this.error = 'Invalid YAML format or missing "elements" array.';
      return;
    }

    this.error = '';
    this.dispatchEvent(
      new CustomEvent('config-updated', {
        detail: { config: parsed },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async _copyYaml() {
    try {
      await navigator.clipboard.writeText(this.yamlText);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    } catch (e) {
      console.error('Failed to copy YAML:', e);
    }
  }

  render() {
    return html`
      <div class="toolbar">
        <span class="toolbar-title">YAML Configuration</span>
        <div class="btn-group">
          <button class="btn-copy" @click=${this._copyYaml}>
            ${this.copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <button class="btn-apply" @click=${this._applyYaml}>
            Apply Changes
          </button>
        </div>
      </div>
      <div class="editor-container">
        <textarea
          .value=${this.yamlText}
          @input=${this._onYamlInput}
          spellcheck="false"
        ></textarea>
        ${this.error ? html`<div class="error-banner">${this.error}</div>` : ''}
      </div>
    `;
  }
}
