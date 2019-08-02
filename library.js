let cheerio = require('cheerio'),
  debug = require('debug')('nodebb-plugin-lightgallery:library');

module.exports.myfiltermethod = function myfiltermethod(data, callback) {
  debug('\n\n--------- myfiltermethod ---------n\n');
  
  /* Added this for debugging purposes to be able to see what the data looked like before messing with it.
     However it seems that it's breaking because we actually do want to chanage /api routes.  Realizing this
     right now as I'm trying to determine why inital page topic loads don't work!  Re-evaluation this.
  
  // Ignore api routes
  if (data.req.path.startsWith('/api')) {
    return callback(null, data);
  }
  */

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
    debug('\n\n---------' + html + '---------\n\n');
    post.content = html;
    return post;
  }
  return callback(null, data);
}

