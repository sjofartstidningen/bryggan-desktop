/**
 * Fixture response from /files/list_folder
 *
 * Update fixture with the following command:
 *  curl -X POST https://api.dropboxapi.com/2/files/list_folder \
 *    --header "Authorization: Bearer <api_key>" \
 *    --header "Content-Type: application/json" \
 *    --data "{\"path\": \"/Tidningen/2018/11\",\"recursive\": false}" > res.json
 */
const filesListFolder = {
  entries: [
    {
      '.tag': 'folder',
      name: 'A',
      path_lower: '/tidningen/2018/11/a',
      path_display: '/Tidningen/2018/11/A',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABfZA',
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        traverse_only: false,
        no_access: false,
      },
    },
    {
      '.tag': 'folder',
      name: 'D',
      path_lower: '/tidningen/2018/11/d',
      path_display: '/Tidningen/2018/11/D',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABfew',
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        traverse_only: false,
        no_access: false,
      },
    },
    {
      '.tag': 'folder',
      name: 'B',
      path_lower: '/tidningen/2018/11/b',
      path_display: '/Tidningen/2018/11/B',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABf0w',
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        traverse_only: false,
        no_access: false,
      },
    },
    {
      '.tag': 'folder',
      name: 'C',
      path_lower: '/tidningen/2018/11/c',
      path_display: '/Tidningen/2018/11/C',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABf1A',
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        traverse_only: false,
        no_access: false,
      },
    },
    {
      '.tag': 'folder',
      name: 'Framvagn',
      path_lower: '/tidningen/2018/11/framvagn',
      path_display: '/Tidningen/2018/11/Framvagn',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgdw',
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        traverse_only: false,
        no_access: false,
      },
    },
    {
      '.tag': 'folder',
      name: 'till tryckeriet',
      path_lower: '/tidningen/2018/11/till tryckeriet',
      path_display: '/Tidningen/2018/11/till tryckeriet',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABhzA',
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        traverse_only: false,
        no_access: false,
      },
    },
    {
      '.tag': 'file',
      name: 'ST_18_11.indd',
      path_lower: '/tidningen/2018/11/st_18_11.indd',
      path_display: '/Tidningen/2018/11/ST_18_11.indd',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABf2g',
      client_modified: '2018-11-27T15:14:14Z',
      server_modified: '2018-11-27T15:14:19Z',
      rev: '242cc47567939',
      size: 18907136,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AAAD--pzSalcq73PGbc9Ch9fgh0YPSvL1vQ',
      },
      content_hash:
        'd0ba27926e4dbdcbadfbd8658510bb33079eeff70d93f09bd837cd0d96fec31d',
    },
    {
      '.tag': 'file',
      name: 'Sid 23.pdf',
      path_lower: '/tidningen/2018/11/sid 23.pdf',
      path_display: '/Tidningen/2018/11/Sid 23.pdf',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgmA',
      client_modified: '2018-11-29T11:54:26Z',
      server_modified: '2018-11-29T11:54:32Z',
      rev: '2437a47567939',
      size: 3526593,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AADI2C0iKz8PvrovDlpZ6DT3KypYuBReQss',
      },
      content_hash:
        '60a63157e14fbb182feca04fc129188d1348bddef8106c93efabfc6b4d3bde56',
    },
    {
      '.tag': 'file',
      name: 'ST_11_18_01_Framvagn.indd',
      path_lower: '/tidningen/2018/11/st_11_18_01_framvagn.indd',
      path_display: '/Tidningen/2018/11/ST_11_18_01_Framvagn.indd',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgUg',
      client_modified: '2018-12-05T07:53:43Z',
      server_modified: '2018-12-05T07:53:48Z',
      rev: '246b647567939',
      size: 16314368,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AAAD--pzSalcq73PGbc9Ch9fgh0YPSvL1vQ',
      },
      content_hash:
        '7aa1cae47209ad8e2ff4aa2b34ecc8437e668b58adb88d21e88c7eb794abea12',
    },
    {
      '.tag': 'file',
      name: 'ST_11_18_05_D.indd',
      path_lower: '/tidningen/2018/11/st_11_18_05_d.indd',
      path_display: '/Tidningen/2018/11/ST_11_18_05_D.indd',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgWA',
      client_modified: '2018-12-05T08:23:00Z',
      server_modified: '2018-12-05T08:23:09Z',
      rev: '246c447567939',
      size: 23642112,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AAAGsBZeMJWLDSD-bUhgCmyfDrXDDBlV-70',
      },
      content_hash:
        '50c5ab7c48a63d2f257c17e945b29334ef4bd5c42d064d9993fa2876447d5140',
    },
    {
      '.tag': 'file',
      name: 'ST_11_18_03_B.indd',
      path_lower: '/tidningen/2018/11/st_11_18_03_b.indd',
      path_display: '/Tidningen/2018/11/ST_11_18_03_B.indd',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgVg',
      client_modified: '2018-12-05T09:03:13Z',
      server_modified: '2018-12-05T09:03:18Z',
      rev: '246d547567939',
      size: 18354176,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AAAD--pzSalcq73PGbc9Ch9fgh0YPSvL1vQ',
      },
      content_hash:
        'cde1429b2b1e8d43d6578bdf8f225252b3f7687892952ae9f1bc7084cd210cb6',
    },
    {
      '.tag': 'file',
      name: 'ST_11_18_04_C.indd',
      path_lower: '/tidningen/2018/11/st_11_18_04_c.indd',
      path_display: '/Tidningen/2018/11/ST_11_18_04_C.indd',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgVw',
      client_modified: '2018-12-05T09:13:30Z',
      server_modified: '2018-12-05T09:13:35Z',
      rev: '2479847567939',
      size: 16797696,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AACCoALvX2HMOAqzduK1KNK1IPOb-MKGieI',
      },
      content_hash:
        '949e5c407cd7937ef407e25b25a4805ef67b58ba753c2a5d42fa844ae01e033c',
    },
    {
      '.tag': 'file',
      name: 'ST_11_18_02_A.indd',
      path_lower: '/tidningen/2018/11/st_11_18_02_a.indd',
      path_display: '/Tidningen/2018/11/ST_11_18_02_A.indd',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABgVA',
      client_modified: '2018-12-05T11:16:46Z',
      server_modified: '2018-12-05T11:16:52Z',
      rev: '2479c47567939',
      size: 19832832,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AAAD--pzSalcq73PGbc9Ch9fgh0YPSvL1vQ',
      },
      content_hash:
        '68aa69a67cda075d06025adea11827006623748ad1474be18eed1ed3707c68d6',
    },
    {
      '.tag': 'file',
      name: '~st_11_18_01_framva~y0mey8.idlk',
      path_lower: '/tidningen/2018/11/~st_11_18_01_framva~y0mey8.idlk',
      path_display: '/Tidningen/2018/11/~st_11_18_01_framva~y0mey8.idlk',
      parent_shared_folder_id: '1196849465',
      id: 'id:8cfsOlDXQ0AAAAAAAABiTA',
      client_modified: '2018-12-07T07:16:08Z',
      server_modified: '2018-12-07T07:16:14Z',
      rev: '247a847567939',
      size: 0,
      sharing_info: {
        read_only: false,
        parent_shared_folder_id: '1196849465',
        modified_by: 'dbid:AACrh22Y3qGiQTCRwwE3IHv4GvbjqNoznG8',
      },
      content_hash:
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ],
  cursor:
    'AAGW04r7iXCgl1M02apsYHibNpqWwElo_Q-szs6wjYEGabyiMIjmnSxTSruDLWCa_AfNz0IM1Y06bjEyIraLVlymtGd7Nxtu3Oj3glSJR5TyHuaDEuPC6blwjv7_KsO8TljFZy1JclAuRClMiX5BA9uj2FTXYtAlN_pV6gB8rEk4ISYZuYt4gpTkQTMv7YLee9VTvBiLkDsngkAWeNni488exIaTq8xX3xSKQ_rvcc6PRnm7nQrc7HBeB3425qTQCAY',
  has_more: false,
};

const getAccount = {
  account_id: 'dbid:AACrh22Y3qGiQTCRwwE3IHv4GvbjqNoznG8',
  name: {
    given_name: 'Adam',
    surname: 'Bergman',
    familiar_name: 'Adam',
    display_name: 'Adam Bergman',
    abbreviated_name: 'AB',
  },
  email: 'adam.bergman@sjofartstidningen.se',
  email_verified: true,
  profile_photo_url:
    'https://dl-web.dropbox.com/account_photo/get/dbaphid%3AAAB-Yblu_z6W0CyArB8E-ymgpphnLEabMkk?size=128x128&vers=1460967974696',
  disabled: false,
  is_teammate: true,
  team_member_id: 'dbmid:AADhwrnyWESM_u0pImgwyWiB3lHn3ac4ioY',
};

const getCurrentAccount = {
  account_id: 'dbid:AACrh22Y3qGiQTCRwwE3IHv4GvbjqNoznG8',
  name: {
    given_name: 'Adam',
    surname: 'Bergman',
    familiar_name: 'Adam',
    display_name: 'Adam Bergman (Sj\u00f6fartstidningen)',
    abbreviated_name: 'AB',
  },
  email: 'adam.bergman@sjofartstidningen.se',
  email_verified: true,
  profile_photo_url:
    'https://dl-web.dropbox.com/account_photo/get/dbaphid%3AAAB-Yblu_z6W0CyArB8E-ymgpphnLEabMkk?size=128x128&vers=1460967974696',
  disabled: false,
  country: 'SE',
  locale: 'sv-SE',
  referral_link: 'https://db.tt/NGVu5e5uK1',
  team: {
    id: 'dbtid:AADbFdmDgcSCo5WQ6MesF_q59ltpbjw1lms',
    name: 'Sj\u00f6fartstidningen',
    sharing_policies: {
      shared_folder_member_policy: { '.tag': 'anyone' },
      shared_folder_join_policy: { '.tag': 'from_anyone' },
      shared_link_create_policy: { '.tag': 'default_public' },
    },
    office_addin_policy: { '.tag': 'enabled' },
  },
  team_member_id: 'dbmid:AADhwrnyWESM_u0pImgwyWiB3lHn3ac4ioY',
  is_paired: true,
  account_type: { '.tag': 'business' },
  root_info: {
    '.tag': 'user',
    root_namespace_id: '1194401041',
    home_namespace_id: '1194401041',
  },
};

export { filesListFolder, getAccount, getCurrentAccount };
