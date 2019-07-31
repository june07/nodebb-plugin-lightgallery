let cheerio = require('cheerio');

module.exports.myfiltermethod = function myfiltermethod(data, callback) {
  console.log('myfiltermethod');
  if (data.templateData.posts) {
    let content = data.templateData.posts['0'].content;
    let $ = cheerio.load(content);

    let lightgalleryWrapper = $('<div id="lightgallery"></div>');
    $('p').wrap(lightgalleryWrapper);
    $('img').map((i, e) => {
      let imgsrc = $(e).attr('src');
      let anchorWrapper = $('<a></a>');
      $(e).attr('data-src', imgsrc);
      $(e).attr('data-exThumbImage', imgsrc);
      $(anchorWrapper).attr('href', imgsrc);
      
      e = $(e).wrap(anchorWrapper);
      return e;
    });
    data.templateData.posts['0'].content = $('body').html();
  }
  callback(null, data);
}
