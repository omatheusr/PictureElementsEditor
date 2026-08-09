import jsYaml from 'js-yaml';
import { PictureElementsCardConfig } from '../types';

export function objectToYaml(config: PictureElementsCardConfig): string {
  try {
    return jsYaml.dump(config, {
      indent: 2,
      noRefs: true,
      lineWidth: -1,
    });
  } catch (e) {
    console.error('YAML Dump Error:', e);
    return '';
  }
}

export function yamlToObject(yamlStr: string): PictureElementsCardConfig | null {
  try {
    const doc = jsYaml.load(yamlStr) as PictureElementsCardConfig;
    if (doc && typeof doc === 'object' && Array.isArray(doc.elements)) {
      return doc;
    }
    return null;
  } catch (e) {
    console.error('YAML Parse Error:', e);
    return null;
  }
}

export function createDefaultConfig(): PictureElementsCardConfig {
  return {
    type: 'picture-elements',
    title: 'My Floorplan',
    image: 'https://demo.home-assistant.io/stub_config/floorplan.png',
    elements: [
      {
        type: 'state-badge',
        entity: 'sensor.temperature',
        style: {
          top: '32%',
          left: '40%',
        },
      },
      {
        type: 'state-icon',
        entity: 'light.living_room',
        style: {
          top: '50%',
          left: '50%',
        },
        tap_action: {
          action: 'toggle',
        },
      },
      {
        type: 'state-label',
        entity: 'sensor.humidity',
        prefix: 'Humidity: ',
        style: {
          top: '70%',
          left: '30%',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 8px',
          borderRadius: '4px',
        },
      },
    ],
  };
}
