import { LitElement } from 'lit';
import { PictureElementConfig, HomeAssistant } from '../types';
export declare class PebCanvas extends LitElement {
    image: string;
    elements: PictureElementConfig[];
    selectedIndex: number;
    hass?: HomeAssistant;
    private isDragging;
    private dragIndex;
    private dragStartX;
    private dragStartY;
    private initialTopPct;
    private initialLeftPct;
    static styles: import("lit").CSSResult;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _renderElementContent;
    render(): import("lit-html").TemplateResult<1>;
}
