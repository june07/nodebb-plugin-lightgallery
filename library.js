let cheerio = require('cheerio');

module.exports.myfiltermethod = function myfiltermethod(data, callback) {
  // Ignore api routes
  if (data.req.path.startsWith('/api')) {
    return callback(null, data);
  }

  if (data.templateData.posts !== undefined) {
    let updatedPosts = data.templateData.posts.map(post => {
      return updatePost(post);
    });
    data.templateData.posts = updatedPosts;
    
    callback(null, data);
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
    //console.log('\n\n---------' + html + '-------\n\n');
    post.content = html;
    return post;
  }
  return callback(null, data);
}

