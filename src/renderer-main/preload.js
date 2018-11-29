/**
 * Use this file to add secure node apis to be used inside the renderer process
 * Eg.:
 *   import fs from 'fs';
 *   import { promisify } from 'util';
 *
 *   const readFile = promisify(fs.readFile);
 *   window.readConfig = async () => {
 *     const rawConfig = await readFile('path/to/config.json', 'utf-8');
 *     const config = JSON.parse(rawConfig);
 *     return config;
 *   };
 */
