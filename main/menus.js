const { Menu } = require('electron');

const trayMenuTemplate = [
  {
    label: 'Inställningar…',
    accelerator: 'Cmd+,',
    click: () => {},
  },
  {
    type: 'separator',
  },
  {
    label: 'Avsluta Bryggan',
    role: 'quit',
    accelerator: 'Command+Q',
  },
];

const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);

module.exports = { trayMenu };
