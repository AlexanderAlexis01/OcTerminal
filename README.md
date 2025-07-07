# OC Character Database Terminal

A retro terminal-style character database application with a Windows 98 aesthetic.

## Features

- Character profile creation and editing
- Image gallery with upload functionality  
- Discovered files system with encrypted content
- Command prompt with investigation tools
- HWID spoofing game mechanics
- Ori plushie mini-game
- Retro CRT monitor effects

## Setup for GitHub Pages

1. Upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at `https://yourusername.github.io/repository-name`

**Important:** Make sure all asset files are uploaded:
- dust.png (dust particle effect)
- Ori.png (plushie character image)
- explosion.gif (explosion animation)
- All audio files (.mp3, .opus)

## File Structure

Your repository should look like this:
```
/
├── index.html
├── styles.css
├── main.js
├── database-manager.js
├── image-handler.js
├── oc-document.js
├── boot-sequence.js
├── ui-effects.js
├── dust.png
├── Ori.png
├── explosion.gif
├── ambient.mp3
├── boot.mp3
├── old-computer-click-152513.mp3
├── errors-llargs-77182.mp3
├── old-desktop-pc-booting-24280.mp3
├── computer-startup-sound-effect-312870.mp3
├── computer-idle-ambient-loop-001-8420.mp3
├── SqueakyToy.opus
├── Roblox Explosion Sound Effect.mp3
├── user_images/ (if any)
└── saved_data.json
```

## Usage

- Fill out character information in the editor
- Switch between editor and main views using navigation buttons
- Upload images to the character gallery
- Use the command prompt to discover hidden files
- Interact with various easter eggs and mini-games

## Data Persistence

Character data and images are saved to localStorage and will persist between sessions.
User data is included in the `saved_data.json` file for backup purposes.

## Browser Compatibility

Works best in modern browsers with JavaScript enabled.
Tested on Chrome, Firefox, Safari, and Edge.

## Troubleshooting

If assets are not loading:
1. Check that all files were uploaded to the correct directory
2. Verify file names match exactly (case-sensitive)
3. Check browser console for 404 errors
4. Ensure GitHub Pages is properly configured

See TROUBLESHOOTING.md for more detailed help.
