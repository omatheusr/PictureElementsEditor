import { HomeAssistant } from '../types';
export declare function getEntityList(hass?: HomeAssistant): string[];
export declare function getEntityName(entityId: string, hass?: HomeAssistant): string;
export declare function getEntityIcon(entityId: string, hass?: HomeAssistant): string;
export declare function formatEntityState(entityId: string, hass?: HomeAssistant): string;
export declare function computeStyleString(styleObj?: Record<string, string | number>): string;
