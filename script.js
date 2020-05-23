require(['lightgallery'], function(lightgallery) {
  require(['lg-thumbnail', 'lg-autoplay', 'lg-video', 'lg-fullscreen', 'lg-pager', 'lg-zoom', 'lg-hash', 'lg-share'], function(lgthumbnail, lgautoplay, lgvideo, lgfullscreen, lgpager, lgzoom, lghash, lgshare) {
    $(document).ready(function() {
      initLightGallery();
    });
    $(window).on('action:topic.loaded', function(data) {
      initLightGallery();
    });
    function initLightGallery() {
      $("[id^=lightgallery]").lightGallery({
        selector: 'a > img'
      });
    }
  });
});

