import { LitElement } from 'lit';
import { PictureElementConfig, PictureElementsCardConfig, HomeAssistant } from '../types';
export declare class PebSidebar extends LitElement {
    cardConfig: PictureElementsCardConfig | null;
    element: PictureElementConfig | null;
    selectedIndex: number;
    hass?: HomeAssistant;
    private activeTooltip;
    private activeActionTab;
    static styles: import("lit").CSSResult;
    private _toggleHelp;
    private _renderHelpBtn;
    private _updateElementField;
    private _updateStyle;
    private _updateAction;
    private _addCondition;
    private _updateCondition;
    private _deleteCondition;
    private _dispatchElementUpdate;
    private _deleteElement;
    private _updateCardField;
    render(): import("lit-html").TemplateResult<1>;
}
