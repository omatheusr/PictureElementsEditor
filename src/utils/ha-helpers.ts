import { HomeAssistant, HassEntity } from '../types';

export function getEntityList(hass?: HomeAssistant): string[] {
  if (!hass || !hass.states) return [];
  return Object.keys(hass.states).sort();
}

export function getEntityName(entityId: string, hass?: HomeAssistant): string {
  if (!hass || !hass.states || !hass.states[entityId]) return entityId;
  const entity = hass.states[entityId];
  return entity.attributes.friendly_name || entityId;
}

export function getEntityIcon(entityId: string, hass?: HomeAssistant): string {
  if (!hass || !hass.states || !hass.states[entityId]) return 'mdi:bookmark';
  const entity = hass.states[entityId];
  if (entity.attributes.icon) return entity.attributes.icon;

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
}

export function formatEntityState(entityId: string, hass?: HomeAssistant): string {
  if (!hass || !hass.states || !hass.states[entityId]) return 'OFFLINE';
  const entity: HassEntity = hass.states[entityId];
  const unit = entity.attributes.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : '';
  return `${entity.state}${unit}`;
}

export function computeStyleString(styleObj?: Record<string, string | number>): string {
  if (!styleObj) return '';
  return Object.entries(styleObj)
    .map(([key, val]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};`)
    .join(' ');
}
