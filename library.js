const debug = (process.env.NODE_ENV === 'dev')
    ? require('debug')('nodebb-plugin-lightgallery:library')
    : undefined
const cheerio = require('cheerio')
let plugin = {}

plugin.myfiltermethod = function myfiltermethod(data, callback) {
    function updatePost(post) {
        const $ = cheerio.load('<div id="lg-post-wrapper' + post.pid + '">' + post.content + '</div>')
        const lightgalleryWrapper = $('<div id="lightgallery' + post.pid + '"></div>')

        if ($('p > img').length > 0) $('#lg-post-wrapper' + post.pid).wrap(lightgalleryWrapper)

        $('p > img').map((i, e) => {
            let imgsrc = $(e).attr('src')
            let anchorWrapper = $('<a></a>')

            $(e).attr('data-src', imgsrc)
            $(e).attr('data-exThumbImage', imgsrc)
            $(anchorWrapper).attr('href', '#')
            $(e).wrap(anchorWrapper)
        })
        const html = $('body').html()
        if (debug) debug('---------' + html + '---------')
        post.content = html
        return post
    }

    if (debug) debug('--------- myfiltermethod ---------')

    if (data.templateData.posts !== undefined) {
        data.templateData.posts = data.templateData.posts.map(updatePost)
    }

    return callback(null, data)
}

module.exports = plugin