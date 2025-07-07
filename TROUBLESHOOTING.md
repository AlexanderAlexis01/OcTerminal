# Troubleshooting Guide

## Common Issues and Solutions

### Assets Not Loading (dust.png, Ori.png, explosion.gif)

**Problem:** Images or sounds not displaying/playing on GitHub Pages.

**Solutions:**
1. **Check file upload:** Ensure all asset files are uploaded to the root directory of your repository
2. **Verify file names:** File names are case-sensitive. Make sure they match exactly:
   - `dust.png` (not `Dust.png` or `dust.PNG`)
   - `Ori.png` (not `ori.png` or `ORI.png`)
   - `explosion.gif` (not `Explosion.gif`)
3. **Check file formats:** 
   - Images should be PNG/GIF format
   - Audio should be MP3/OPUS format
4. **Repository structure:** All files should be in the root directory, not in subfolders

### GitHub Pages Not Working

**Problem:** Site not accessible at GitHub Pages URL.

**Solutions:**
1. Go to repository Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Wait 5-10 minutes for deployment
5. Check that index.html is in the root directory

### Console Errors

**Problem:** JavaScript errors in browser console.

**Solutions:**
1. Check that all .js files are uploaded
2. Verify no syntax errors in uploaded files
3. Clear browser cache and reload
4. Check Network tab for failed file requests

### Audio Not Playing

**Problem:** Sound effects not working.

**Solutions:**
1. Check browser autoplay policies
2. User interaction required before audio can play
3. Verify audio files are properly uploaded
4. Check file formats (MP3 recommended for compatibility)

### localStorage Data

**Problem:** Character data not persisting.

**Solutions:**
1. localStorage works per domain/subdomain
2. Data saved on local version won't transfer to GitHub Pages
3. Use saved_data.json to restore data manually if needed

## File Verification Checklist

- [ ] index.html in root directory
- [ ] All .js files uploaded
- [ ] styles.css uploaded  
- [ ] dust.png uploaded (check file size > 0)
- [ ] Ori.png uploaded (check file size > 0)
- [ ] explosion.gif uploaded (check file size > 0)
- [ ] All audio files uploaded
- [ ] GitHub Pages enabled in settings
- [ ] No 404 errors in browser Network tab

## Getting Help

If issues persist:
1. Check browser console for error messages
2. Verify all files are in the repository
3. Test locally first before uploading
4. Check GitHub Pages deployment status
