#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const pkgPath = path.join(__dirname, '../package.json')
const pluginPath = path.join(__dirname, '../plugin.json')

try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'))

    if (pkg.version && plugin.version !== pkg.version) {
        console.log(`[sync-version] Updating plugin.json version: ${plugin.version} → ${pkg.version}`)
        plugin.version = pkg.version
        fs.writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + '\n', 'utf8')
    } else {
        console.log('[sync-version] Versions already match, nothing to do.')
    }
} catch (err) {
    console.error('[sync-version] Failed:', err)
    process.exit(1)
}
