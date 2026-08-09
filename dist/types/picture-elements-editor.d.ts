import { LitElement } from 'lit';
import { PictureElementsCardConfig, HomeAssistant, PanelInfo } from './types';
import './components/peb-canvas';
import './components/peb-sidebar';
import './components/peb-palette';
import './components/peb-yaml-editor';
import './components/peb-image-selector';
export declare class PictureElementsEditor extends LitElement {
    hass?: HomeAssistant;
    isPanel: boolean;
    private config;
    private selectedIndex;
    private activeTab;
    private isPaletteOpen;
    setConfig(config: PictureElementsCardConfig): void;
    getCardSize(): number;
    static getStubConfig(): PictureElementsCardConfig;
    static styles: import("lit").CSSResult;
    private _toggleHASidebar;
    private _onImageChanged;
    private _onElementSelected;
    private _onElementsMoved;
    private _onElementUpdated;
    private _onCardConfigUpdated;
    private _onElementDeleted;
    private _onAddElement;
    private _onConfigFromYaml;
    private _fireConfigChanged;
    render(): import("lit-html").TemplateResult<1>;
}
export declare class HaPanelPictureElementsEditor extends LitElement {
    hass: HomeAssistant;
    narrow: boolean;
    panel: PanelInfo;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
