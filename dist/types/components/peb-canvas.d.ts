import { LitElement } from 'lit';
import { PictureElementConfig, HomeAssistant } from '../types';
export declare class PebCanvas extends LitElement {
    image: string;
    elements: PictureElementConfig[];
    selectedIndex: number;
    hass?: HomeAssistant;
    private isDragging;
    private dragIndex;
    private zoomScale;
    private dragStartX;
    private dragStartY;
    private initialTopPct;
    private initialLeftPct;
    static styles: import("lit").CSSResult;
    private _zoomIn;
    private _zoomOut;
    private _zoomReset;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _renderElementContent;
    render(): import("lit-html").TemplateResult<1>;
}
