'use strict';

const { Menu } = require('electron');
const { getIcon } = require('./utils/icons.js');
const { productName, version } = require('../package.json');

const trayMenuTemplate = [
  {
    icon: getIcon('trayIconTemplate.png'),
    label: `${productName} v${version}`,
    enabled: false,
  },
  {
    type: 'separator',
  },
  {
    label: 'Inställningar…',
    accelerator: 'Cmd+,',
    click: () => {},
  },
  {
    label: 'Avsluta Bryggan',
    role: 'quit',
    accelerator: 'Command+Q',
  },
];

const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);

module.exports = { trayMenu };
