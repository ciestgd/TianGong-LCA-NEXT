import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pages_contact from './en-US/pages_contact';
import pages_general from './en-US/pages_general';
import pages_unitgroup from './en-US/pages_unitgroup';
import pages_flowproperties from './en-US/pages_flowproperties';
import pages_flows from './en-US/pages_flows';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...pages_general,
  ...pages_contact,
  ...pages_unitgroup,
  ...pages_flowproperties,
  ...pages_flows
};
