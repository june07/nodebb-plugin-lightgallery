let cheerio = require('cheerio'),
  debug = require('debug')('nodebb-plugin-lightgallery:library');

module.exports.myfiltermethod = function myfiltermethod(data, callback) {
  debug('--------- myfiltermethod ---------');

  if (data.templateData.posts !== undefined) {
    let updatedPosts = data.templateData.posts.map(post => {
      return updatePost(post);
    });
    data.templateData.posts = updatedPosts;
    
    return callback(null, data);
  }
  function updatePost(post) {
    let $ = cheerio.load('<div id="lg-post-wrapper' + post.pid + '">' + post.content + '</div>');
    let lightgalleryWrapper = $('<div id="lightgallery' + post.pid + '"></div>');

    if ($('p > img').length > 0) $('#lg-post-wrapper' + post.pid).wrap(lightgalleryWrapper);
    $('p > img').map((i, e) => {
      let imgsrc = $(e).attr('src');
      let anchorWrapper = $('<a></a>');
      $(e).attr('data-src', imgsrc);
      $(e).attr('data-exThumbImage', imgsrc);
      $(anchorWrapper).attr('href', imgsrc);
      
      $(e).wrap(anchorWrapper);
    });
    let html = $('body').html();
    debug('---------' + html + '---------');
    post.content = html;
    return post;
  }
  return callback(null, data);
}
module.exports.filterUploadImage = function filterUploadImage(image, uid) {
  debugger
}
