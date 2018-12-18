<div align="center">
  <h1>Bryggan Desktop</h1>
  <p>The gap between InDesign and Dropbox</p>
</div>

<div align="center">
  <img src="resources/screenshot.png">
</div>

This is a productivity app mainly created for usage inside our company – but it
should probably work outside our company as well.

## Goal

We produce a magazine once a month and every month we do parallel work in
InDesign-files stored in our Dropbox-team folders.

Normally, when opening InDesign-files on your normal harddrive, or through other
types of servers, InDesign will check .idlk-files associated with the
InDesign-files.

If an associated .idlk-file is found, **and** if it's not created by the current
user, InDesign will refuse to open it. But if you do the same thing inside a
Dropbox-folder every file will seem to, according to your OS, be created by the
current user. And InDesign will happily open the InDesign-file.

And if that happens and two people perform changes at the same time on the same
file the app will crash and changes might get lost in the void.

The goal of this tiny utility app is to bridge the gap between InDesign and
Dropbox and try to prevent simultaneous edits.

## Solution

This app, _Bryggan_, can be used as a simple file explorer to traverse your
team-folder contents from the desktop.

And when it encounters an .indd-file it will make an extra check to see if a
corresponding .idlk-file exists. If it exists it will refuse to open the
.indd-document.

The app checks everything against the Dropbox API:s which probably makes the
check a bit more secure. As compared to only check against the local filesystem
and the files synced by Dropbox to your local computer.

## Distribution

As of now this app can't be downloaded, it is only distributed internally at our
company due to the fact that I have'nt yet found a way to properly hide and
secure important secrets – specifically the Dropbox Oauth Secret used to
authenticate users against Dropbox.

If anyone knows of a way to properly hide secrets in an Electron-based
application – please shout out!

## License

MIT  
Copyright (c) 2018 sjofartstidningen
