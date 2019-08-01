#!/bin/bash
rm -fR dist
function build {
    package=$1
    cd node_modules/$package
    echo `pwd`
    sed -i "s/'default'\:\s\['\$'\]/default: ['jQuery']/" Gruntfile.js
    npm install
    if [[ $package == "lightgallery" ]]; then
	 sed -i "s/'connect', 'qunit', 'umd:all'/'connect', 'umd:all'/" Gruntfile.js
    fi
    grunt --force
    if [[ $package == "lightgallery" ]]; then
        mv dist ../../
        mkdir ../../dist/plugins
    else
        cp dist/${package}.min.js ../../dist/plugins/
    fi
    cd ../..
    echo `pwd`
}

sed -i "s/\$lg-path-fonts:\s'.*'/\$lg-path-fonts: '\.\.\/plugins\/nodebb-plugin-lightgallery\/fonts\/'/" ./node_modules/lightgallery/src/sass/lg-variables.scss
sed -i "s/\$lg-path-images:\s'.*'/\$lg-path-images: '\.\.\/plugins\/nodebb-plugin-lightgallery\/images\/'/" ./node_modules/lightgallery/src/sass/lg-variables.scss
build lightgallery
plugins='lg-thumbnail lg-autoplay lg-video lg-fullscreen lg-pager lg-zoom lg-hash lg-share'
for plugin in $plugins; do
    build $plugin
done

