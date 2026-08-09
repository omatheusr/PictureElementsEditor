export interface HassEntity {
    entity_id: string;
    state: string;
    attributes: {
        friendly_name?: string;
        icon?: string;
        unit_of_measurement?: string;
        domain?: string;
        [key: string]: any;
    };
    last_changed: string;
    last_updated: string;
    context: {
        id: string;
        parent_id: string | null;
        user_id: string | null;
    };
}
export interface HomeAssistant {
    states: Record<string, HassEntity>;
    services: Record<string, Record<string, any>>;
    user: {
        id: string;
        name: string;
        is_admin: boolean;
        is_owner: boolean;
    };
    themes: {
        darkMode: boolean;
        theme: string;
    };
    language: string;
    callService: (domain: string, service: string, serviceData?: Record<string, any>) => Promise<void>;
}
export interface ActionConfig {
    action: 'more-info' | 'toggle' | 'perform-action' | 'call-service' | 'navigate' | 'url' | 'none';
    perform_action?: string;
    service?: string;
    navigation_path?: string;
    url_path?: string;
    target?: Record<string, any>;
    data?: Record<string, any>;
    service_data?: Record<string, any>;
}
export interface ConditionRule {
    entity: string;
    state?: string;
    state_not?: string;
}
export interface PictureElementConfig {
    type: 'state-badge' | 'state-icon' | 'state-label' | 'action-button' | 'service-button' | 'icon' | 'image' | 'conditional' | string;
    entity?: string;
    name?: string | null;
    title?: string | null;
    icon?: string;
    attribute?: string;
    prefix?: string;
    suffix?: string;
    state_color?: boolean;
    image?: string;
    camera_image?: string;
    camera_view?: 'live' | 'auto';
    aspect_ratio?: string;
    filter?: string;
    state_image?: Record<string, string>;
    state_filter?: Record<string, string>;
    action?: string;
    target?: Record<string, any>;
    data?: Record<string, any>;
    service?: string;
    service_data?: Record<string, any>;
    style?: Record<string, string | number>;
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
    conditions?: ConditionRule[];
    elements?: PictureElementConfig[];
    [key: string]: any;
}
export interface PictureElementsCardConfig {
    type: string;
    title?: string;
    image?: string;
    image_entity?: string;
    camera_image?: string;
    camera_view?: 'live' | 'auto';
    theme?: string;
    dark_mode_image?: string;
    dark_mode_filter?: string;
    state_filter?: Record<string, string>;
    aspect_ratio?: string;
    elements: PictureElementConfig[];
    card_mod?: any;
}
export interface PresetElement {
    label: string;
    description: string;
    icon: string;
    config: PictureElementConfig;
}
