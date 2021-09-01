const Lostitem = require('../models/lostitem');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const lostitems = await Lostitem.find({});
    res.render('lostitems/index', { lostitems })
}

module.exports.renderNewForm = (req, res) => {
    res.render('lostitems/new');
}

module.exports.createLostitem = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.lostitem.location,
        limit: 1
    }).send()
    const lostitem = new Lostitem(req.body.lostitem);
    lostitem.geometry = geoData.body.features[0].geometry;
    lostitem.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    lostitem.author = req.user._id;
    await lostitem.save();
    console.log(lostitem);
    req.flash('success', 'Successfully added a new lostitem!');
    res.redirect(`/lostitems/${lostitem._id}`)
}

module.exports.showLostitem = async (req, res,) => {
    const lostitem = await Lostitem.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!lostitem) {
        req.flash('error', 'Cannot find that lostitem!');
        return res.redirect('/lostitems');
    }
    res.render('lostitems/show', { lostitem });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const lostitem = await Lostitem.findById(id)
    if (!lostitem) {
        req.flash('error', 'Cannot find that lostitem!');
        return res.redirect('/lostitems');
    }
    res.render('lostitems/edit', { lostitem });
}

module.exports.updateLostitem = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const lostitem = await Lostitem.findByIdAndUpdate(id, { ...req.body.lostitem });
    const imgs = req.files.map(f=> ({ url: f.path, filename: f.filename }));
    //这里使用...imgs是为了不用更新整个数组，而是指更新被修改的部分
    lostitem.images.push(...imgs);
    await lostitem.save();
    //删除选中的已保存图片，引用cloudinary.uploader.destory来删除云端存储
    if(req.body.deleteImages){
       for(let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
       } 
       await lostitem.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
    }
    req.flash('success', 'Successfully updated lostitem!');
    res.redirect(`/lostitems/${lostitem._id}`)
}

module.exports.deleteLostitem = async (req, res) => {
    const { id } = req.params;
    await Lostitem.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted lostitem')
    res.redirect('/lostitems');
}