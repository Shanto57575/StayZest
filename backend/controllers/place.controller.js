import Place from "../models/place.model.js";

const addPlace = async (req, res) => {
    const {
        title,
        description,
        country,
        location,
        price,
        averageRating,
        photos,
        availability,
        placeTypes,
        totalGuests,
        bedrooms,
        bathrooms
    } = req.body;

    if (!title || !description || !country || !location || !price || !averageRating || !photos || !availability || !placeTypes || !totalGuests || !bedrooms || !bathrooms) {
        return res.status(404).json({ error: 'All Fields are required!' })
    }

    try {
        const newPlace = new Place({
            title,
            description,
            country,
            location,
            price,
            averageRating,
            photos,
            availability,
            placeTypes,
            totalGuests,
            bedrooms,
            bathrooms
        })

        const createdPlace = await newPlace.save();
        res.status(201).json({ message: "New Places added successfully!", createdPlace })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllPlace = async (req, res) => {
    const { page = 1, limit = 8, sortBy = 'price_desc', filterCountry, searchTitle } = req.query;

    const query = {};

    if (filterCountry) {
        query.country = filterCountry
    }

    if (searchTitle) {
        query.location = {
            $regex: searchTitle,
            $options: 'i'
        }
    }

    let sort = {};

    if (sortBy === 'price_asc') {
        sort.price = 1;
    }
    else if (sortBy === 'price_desc') {
        sort.price = -1;
    }

    const skip = (page - 1) * limit

    try {
        const places = await Place.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))

        const totalPlaces = await Place.countDocuments(query);

        res.status(200).json(
            {
                places,
                totalPages: Math.ceil(totalPlaces / limit),
                currentPage: Number(page)
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getPlaceById = async (req, res) => {
    const placeId = req.params.id
    try {
        const place = await Place.findById(placeId)
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updatePlace = async (req, res) => {
    const placeId = req.params.id
    const placeData = req.body;

    try {
        const place = await Place.findByIdAndUpdate(placeId, placeData, { new: true });
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removePlace = async (req, res) => {
    const placeId = req.params.id

    try {
        const place = await Place.findByIdAndDelete(placeId);
        if (!place) {
            return res.status(404).json({ error: "Place Not Found" });
        }
        res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export {
    addPlace,
    getAllPlace,
    getPlaceById,
    updatePlace,
    removePlace
}