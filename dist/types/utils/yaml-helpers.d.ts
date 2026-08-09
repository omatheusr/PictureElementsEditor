import { PictureElementsCardConfig } from '../types';
export declare function objectToYaml(config: PictureElementsCardConfig): string;
export declare function yamlToObject(yamlStr: string): PictureElementsCardConfig | null;
export declare function createDefaultConfig(): PictureElementsCardConfig;
