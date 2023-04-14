const uses = require("../data/uses-data");

function list(req, res) {
    const { urlId } = req.params;
    res.json({ data: uses.filter(urlId ? use => use.urlId == urlId : ()=>true) });
}

function read(req, res, next){
    const { urlId, useId } = req.params;
    const foundUse = uses.filter(urlId ? use => use.urlId == urlId : ()=> true).find((use)=>use.id === Number(useId));
    if (foundUse) {
        res.json({data: foundUse});
    }
    else{
        return next({
            status: 404,
            message: `Use id not found: ${useId}`,
          });
    }  
}
function useExists(req, res, next){
    const { useId } = req.params;
    const use = uses.find((use) => use.id === Number(useId));
    if(use){
        return next();
    }
    next({
        status: 404,
        message: "use was not found"
    });
}

function destroy(req, res, next){
    const { useId } = req.params;
    const index = uses.findIndex((use) => use.id === Number(useId));
    const deletedPastes = uses.splice(index, 1);
    res.sendStatus(204);
}

module.exports={
    list,
    read,
    delete: [useExists, destroy]
}
   