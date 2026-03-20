import { LocationSurcharge } from '../models/index.js';

// Admin: Get all location surcharges
export const getAllSurcharges = async (req, res) => {
  try {
    const surcharges = await LocationSurcharge.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      count: surcharges.length,
      data: surcharges
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create a new location surcharge
export const createSurcharge = async (req, res) => {
  try {
    const { name, surcharge } = req.body;

    // Check if this location already exists
    const existing = await LocationSurcharge.findOne({ where: { name } });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A surcharge for "${name}" already exists. Update it instead.`
      });
    }

    const location = await LocationSurcharge.create({ name, surcharge });

    res.status(201).json({ success: true, data: location });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: Update a surcharge by ID
export const updateSurcharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surcharge } = req.body;

    const location = await LocationSurcharge.findByPk(id);

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location surcharge not found' });
    }

    await location.update({ name, surcharge });

    res.json({ success: true, data: location });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: Delete a surcharge by ID
export const deleteSurcharge = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await LocationSurcharge.findByPk(id);

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location surcharge not found' });
    }

    await location.destroy();

    res.json({ success: true, message: 'Location surcharge deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
