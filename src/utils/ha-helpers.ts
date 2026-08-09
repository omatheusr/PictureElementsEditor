import { HomeAssistant, HassEntity } from '../types';

export function getEntityList(hass?: HomeAssistant): string[] {
  if (!hass || !hass.states) return [];
  try {
    return Object.keys(hass.states).sort();
  } catch (e) {
    console.error('Error fetching entity list:', e);
    return [];
  }
}

export function getEntityName(entityId: string, hass?: HomeAssistant): string {
  if (!hass || !hass.states || !entityId || !hass.states[entityId]) return entityId || 'Unknown Entity';
  try {
    const entity: HassEntity = hass.states[entityId];
    return entity?.attributes?.friendly_name || entityId;
  } catch (e) {
    return entityId;
  }
}

export function getEntityIcon(entityId: string, hass?: HomeAssistant): string {
  if (!hass || !hass.states || !entityId || !hass.states[entityId]) return 'mdi:bookmark';
  try {
    const entity: HassEntity = hass.states[entityId];
    if (entity?.attributes?.icon) return entity.attributes.icon;

    const domain = entityId.split('.')[0];
    switch (domain) {
      case 'light':
        return 'mdi:lightbulb';
      case 'switch':
        return 'mdi:toggle-switch';
      case 'sensor':
        return 'mdi:eye';
      case 'binary_sensor':
        return 'mdi:radiobox-marked';
      case 'climate':
        return 'mdi:thermostat';
      case 'media_player':
        return 'mdi:cast';
      case 'lock':
        return 'mdi:lock';
      case 'cover':
        return 'mdi:window-open';
      case 'fan':
        return 'mdi:fan';
      case 'camera':
        return 'mdi:camera';
      default:
        return 'mdi:shape';
    }
  } catch (e) {
    return 'mdi:shape';
  }
}

export function formatEntityState(entityId: string, hass?: HomeAssistant): string {
  if (!hass || !hass.states || !entityId || !hass.states[entityId]) return 'OFFLINE';
  try {
    const entity: HassEntity = hass.states[entityId];
    if (!entity || entity.state === undefined || entity.state === null) return 'UNKNOWN';
    const unit = entity.attributes?.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : '';
    return `${entity.state}${unit}`;
  } catch (e) {
    return 'ERROR';
  }
}

export function computeStyleString(styleObj?: Record<string, string | number>): string {
  if (!styleObj || typeof styleObj !== 'object') return '';
  try {
    return Object.entries(styleObj)
      .filter(([key, val]) => key && val !== undefined && val !== null)
      .map(([key, val]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};`)
      .join(' ');
  } catch (e) {
    return '';
  }
}
