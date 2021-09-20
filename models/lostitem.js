const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

//virtual就是给前台用而不涉及数据库的该schema私有方法
//比如这里就是把从数据库里读取图片Url中插入w_200使其变成缩略图
//然后再把这个缩略图的url发给前台
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const LostitemSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    time: String,
    email: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

LostitemSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Lostitem', LostitemSchema);