import { app, Menu, shell } from 'electron';

async function setupMenus() {
  const template = [
    {
      label: app.getName(),
      submenu: [
        { label: `${app.getName()} ${app.getVersion()}`, enabled: false },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () =>
            shell.openExternal(
              'https://github.com/sjofartstidningen/bryggan-desktop',
            ),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export { setupMenus };
