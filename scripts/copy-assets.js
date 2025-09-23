const fs = require('fs')
const path = require('path')

function copyFileIfExists(src, dest) {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
        console.log(`Copied ${src} → ${dest}`)
    } else {
        console.warn(`Skipping missing file: ${src}`)
    }
}
function copyDirectoryIfExists(src, dest) {
    if (fs.existsSync(src) && fs.lstatSync(src).isDirectory()) {
        fs.mkdirSync(dest, { recursive: true })
        const entries = fs.readdirSync(src, { withFileTypes: true })
        entries.forEach(entry => {
            const srcPath = path.join(src, entry.name)
            const destPath = path.join(dest, entry.name)
            if (entry.isDirectory()) {
                copyDirectoryIfExists(srcPath, destPath)
            } else {
                copyFileIfExists(srcPath, destPath)
            }
        })
        console.log(`Copied directory ${src} → ${dest}`)
    } else {
        console.warn(`Skipping missing directory: ${src}`)
    }
}
function copyAndPatchScssFiles(lightgalleryRoot, scssSubdir, distScss) {
    const srcDir = path.join(lightgalleryRoot, scssSubdir)

    if (!fs.existsSync(srcDir)) {
        console.error(`[lightgallery] Source SCSS directory does not exist: ${srcDir}`)
        return
    }

    // Read all files in the SCSS directory
    const scssFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.scss'))

    for (const file of scssFiles) {
        const src = path.join(srcDir, file)
        const dest = path.join(distScss, file)

        console.log(`[lightgallery] Processing SCSS: ${src} → ${dest}`)

        let content = fs.readFileSync(src, 'utf8')

        // Only patch _lg-variables.scss
        if (file === '_lg-variables.scss') {
            content = content
                .replace(
                    `$lg-path-fonts: '../fonts' !default;`,
                    `$lg-path-fonts: '/plugins/nodebb-plugin-lightgallery/fonts';`
                )
                .replace(
                    `$lg-path-images: '../images' !default;`,
                    `$lg-path-images: '/plugins/nodebb-plugin-lightgallery/images';`
                )
            console.log(`[lightgallery] Patched variables in: ${file}`)
        }

        // Ensure dist folder exists
        if (!fs.existsSync(distScss)) {
            fs.mkdirSync(distScss, { recursive: true })
        }

        fs.writeFileSync(dest, content, 'utf8')
        console.log(`[lightgallery] Copied SCSS: ${dest}`)
    }
}

// Example usage:
const pluginRoot = path.resolve(__dirname, '..')
const distJs = path.join(pluginRoot, 'dist/js')
const distCss = path.join(pluginRoot, 'dist/css')
const distScss = path.join(pluginRoot, 'dist/scss')
const distAssets = path.join(pluginRoot, 'dist/assets')
fs.mkdirSync(distJs, { recursive: true })
fs.mkdirSync(distCss, { recursive: true })
fs.mkdirSync(distScss, { recursive: true })
fs.mkdirSync(distAssets, { recursive: true })

const lightgalleryRoot = path.join(pluginRoot, 'node_modules/lightgallery')

const jsFiles = [
    'lightgallery.min.js',
    'plugins/autoplay/lg-autoplay.min.js',
    'plugins/fullscreen/lg-fullscreen.min.js',
    'plugins/hash/lg-hash.min.js',
    'plugins/pager/lg-pager.min.js',
    'plugins/share/lg-share.min.js',
    'plugins/thumbnail/lg-thumbnail.min.js',
    'plugins/video/lg-video.min.js',
    'plugins/zoom/lg-zoom.min.js'
]

jsFiles.forEach(file => {
    const src = path.join(lightgalleryRoot, file)
    const dest = path.join(distJs, path.basename(file))
    copyFileIfExists(src, dest)
})

copyAndPatchScssFiles(lightgalleryRoot, 'scss', distScss)

const cssFiles = ['css/lightgallery-bundle.min.css']
cssFiles.forEach(file => {
    const src = path.join(lightgalleryRoot, file)
    const dest = path.join(distCss, path.basename(file))
    copyFileIfExists(src, dest)
})

const assetDirs = ['images', 'fonts']
assetDirs.forEach(dir => {
    const src = path.join(lightgalleryRoot, dir)
    const dest = path.join(distAssets, dir)

    copyDirectoryIfExists(src, dest)
})