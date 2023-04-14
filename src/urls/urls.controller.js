const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function list(req, res, next){
    res.json({data: urls});
}

function hasHref(req, res, next){
    const { data: { href } = {} } = req.body;
  if (href) {
    return next();
  }
  next({
    status: 400,
    message: "A 'href' property is required.",
  });
}

function create(req, res){
    const { data: { href } = {} } = req.body;
  const newUrl = {
    id: urls.length +1, // Increment last id then assign as the current ID
    href
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}
function urlsExists(req, res, next){
    const { urlId } = req.params;
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    if (foundUrl) {
        res.locals.url = foundUrl;
        return next();
    }
    next({
        status: 404,
        message: `Url id not found: ${urlId}`,
    });
}
function read(req, res){
    //const { urlId } = req.params;
    //const foundUrl = urls.find((url) => url.id === Number(urlId));
    const use = {
        id: uses.length+1,
        urlId: res.locals.url.id,
        time: Date.now()
    };
    if(uses.length == 0) uses[0] = use;
    else uses.push(use);
    res.json({data: res.locals.url});
}

function update(req, res){
    let url = res.locals.url;
    let {data: {href} = {}} = req.body;

    url.href = href;
    res.json({data: url});
}


module.exports = {
    list,
    create: [hasHref, create],
    read: [urlsExists, read],
    update: [urlsExists, hasHref, update],
    urlsExists
  };