import { LitElement } from 'lit';
import { PictureElementsCardConfig } from '../types';
export declare class PebYamlEditor extends LitElement {
    config: PictureElementsCardConfig;
    private yamlText;
    private error;
    private copied;
    static styles: import("lit").CSSResult;
    updated(changedProps: Map<string, any>): void;
    private _onYamlInput;
    private _applyYaml;
    private _copyYaml;
    render(): import("lit-html").TemplateResult<1>;
}
