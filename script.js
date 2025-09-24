require(['lightgallery', 'lg-autoplay', 'lg-fullscreen', 'lg-hash', 'lg-pager', 'lg-share', 'lg-thumbnail', 'lg-video', 'lg-zoom'], function (lightGallery, lgAutoplay, lgFullscreen, lgHash, lgPager, lgShare, lgThumbnail, lgVideo, lgZoom) {
    let instances = {}

    function initLightGallery() {
        console.log('Initializing lightGallery...')

        $("[id^=lightgallery]").each(function () {
            if (instances[this.id]) {
                console.log('lightGallery already initialized for id: ', this.id)
                return // skip if already initialized
            }

            let plugins = [lgAutoplay, lgFullscreen, lgHash, lgPager, lgShare, lgThumbnail, lgZoom]

            console.log('Found lightgallery container: ', this.id)

            if ($('#gallery a[data-video]').length) { // or some marker
                plugins.push(lgVideo)
            }

            instances[this.id] = lightGallery(this, {
                plugins,
                selector: 'a:has(img)'
            })

            console.log('lightGallery initialized on container: ', this)
        })

        console.log('lightGallery fully initialized.')
    }

    // Initialize on page load
    $(document).ready(initLightGallery)

    // Initialize on topic infinite scroll
    $(window).on('action:topic.loaded', initLightGallery)
})