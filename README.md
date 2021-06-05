# Markdown-Viewer

![release-version](https://img.shields.io/github/v/release/MrPancakes39/Markdown-Viewer)
[![license](https://img.shields.io/github/license/MrPancakes39/Markdown-Viewer.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html)
![build-status](https://img.shields.io/appveyor/build/MrPancakes39/markdown-viewer)

A Simple Markdown Viewer for rest of us.

<a href="https://github.com/MrPancakes39/Markdown-Viewer/releases/latest/download/markdown-viewer-win32.zip"><img alt="download-for-windows" src="https://raw.githubusercontent.com/MrPancakes39/Markdown-Viewer/main/assets/download-windows.png" width="200px"></a>
<a href="https://github.com/MrPancakes39/Markdown-Viewer/releases/latest/download/markdown-viewer-linux.tar.gz"><img alt="download-for-linux" src="https://raw.githubusercontent.com/MrPancakes39/Markdown-Viewer/main/assets/download-linux.png" width="200px"></a>

## Build From Source

1. Clone the repository
```
$ git clone https://github.com/MrPancakes39/Markdown-Viewer.git
$ cd Markdown-Viewer
```

2. Install dependencies
```
$ yarn
```

3. Build the app
```
$ yarn run gen-tmp
$ yarn run dist
```

## Thanks to

- [QL-Win/QuickLook](https://github.com/QL-Win/QuickLook) for the awesome [markdown to html](https://github.com/QL-Win/QuickLook/blob/master/QuickLook.Plugin/QuickLook.Plugin.MarkdownViewer/Resources/md2html.html) renderer.
- [Electronjs](https://www.electronjs.org/) for me to be able to build desktop apps.
- ... and you for trying this app. 😊❤

## Licenses

![GPL-v3](https://www.gnu.org/graphics/gplv3-127x51.png)

All source codes are licensed under [GPL-3.0](https://opensource.org/licenses/GPL-3.0).
