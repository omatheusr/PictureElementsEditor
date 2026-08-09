"""Custom integration for registering Picture Elements Editor in Home Assistant's left sidebar."""
import logging
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig

_LOGGER = logging.getLogger(__name__)

DOMAIN = "picture_elements_editor"
PANEL_URL_PATH = "picture-elements-editor"
PANEL_TITLE = "Floorplan Editor"
PANEL_ICON = "mdi:floor-plan"
JS_FILENAME = "picture-elements-editor.js"

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the integration via YAML if present."""
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Picture Elements Editor from a config entry (UI integration)."""
    _LOGGER.info("Setting up Picture Elements Editor Sidebar Panel")

    # Serve JS bundle over HTTP
    try:
        await hass.http.async_register_static_paths([
            StaticPathConfig(
                url_path=f"/{PANEL_URL_PATH}/{JS_FILENAME}",
                path=hass.config.path(f"custom_components/{DOMAIN}/www/{JS_FILENAME}"),
                cache_headers=False,
            )
        ])
    except Exception as err:
        _LOGGER.debug("Static path registration notice: %s", err)

    # Register custom panel using panel_custom (official Home Assistant custom panel API)
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name="ha-panel-picture-elements-editor",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        js_url=f"/{PANEL_URL_PATH}/{JS_FILENAME}",
        embed_iframe=False,
        require_admin=False,
    )

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Picture Elements Editor sidebar panel."""
    panel_custom.async_remove_panel(hass, frontend_url_path=PANEL_URL_PATH)
    return True
