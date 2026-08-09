"""Custom integration for registering Picture Elements Editor in Home Assistant's left sidebar."""
import logging
from homeassistant.core import HomeAssistant
from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig

_LOGGER = logging.getLogger(__name__)

DOMAIN = "picture_elements_editor"
PANEL_URL_PATH = "picture-elements-editor"
PANEL_TITLE = "Floorplan Editor"
PANEL_ICON = "mdi:floor-plan"
JS_FILENAME = "picture-elements-editor.js"

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Picture Elements Editor side panel in Home Assistant."""
    _LOGGER.info("Setting up Picture Elements Editor Sidebar Panel")

    # Serve JS bundle over HTTP
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            url_path=f"/{PANEL_URL_PATH}/{JS_FILENAME}",
            path=hass.config.path(f"custom_components/{DOMAIN}/www/{JS_FILENAME}"),
            cache_headers=False,
        )
    ])

    # Register custom panel in Home Assistant main left sidebar
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        url_path=PANEL_URL_PATH,
        config={
          "_js_url": f"/{PANEL_URL_PATH}/{JS_FILENAME}",
          "name": "ha-panel-picture-elements-editor",
        },
        require_admin=False,
    )

    return True
