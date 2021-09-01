const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Lostitem = require('../models/lostitem');

mongoose.connect('mongodb://localhost:27017/lost-found', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Lostitem.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const contact = 'sample@sampleemail.com';
        const item = new Lostitem({
            //YOUR USER ID
            author: '6060a5c3e1cf3b3314e13e6e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            contact,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://www.pickthebrain.com/blog/wp-content/uploads/2013/03/lostandfound1.png',
                    filename: 'LostFound/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://www.usnews.com/dims4/USNEWS/c170dd7/2147483647/thumbnail/970x647/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F1d%2Fb8%2F9a7756ca41e68c5dd75c359a8f94%2F200914-droppedwallet-stock.jpg',
                    filename: 'LostFound/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })
        await item.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})