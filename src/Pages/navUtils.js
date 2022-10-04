import { HomePage } from './home';
import { SelectDevicePage } from './SelectDevicePage';
import { DeviceMenu } from './DeviceMenu';
import { SettingsMenu } from './SettingsMenu';
import FilePage from './FilesMenu';

export const pages = {
    'Home': "home",
    'SELECT_DEVICES_PAGE': 'select_devices_page',
    'DEVICE_MENU': 'deviceMenu',
    'SETTINGS_MENU': 'settingsMenu',
    'FILES_MENU': 'filesMenu',
};

export const pages_obj_references = {
    'home': HomePage,
    'select_devices_page': SelectDevicePage,
    'deviceMenu': DeviceMenu,
    'settingsMenu': SettingsMenu,
    'filesMenu': FilePage,
};

export default { pages, pages_obj_references, };
