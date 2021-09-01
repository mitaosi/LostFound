const Lostitem = require('../models/lostitem');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const lostitem = await Lostitem.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    lostitem.reviews.push(review);
    await review.save();
    await lostitem.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/lostitems/${lostitem._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Lostitem.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/lostitems/${id}`);
}
