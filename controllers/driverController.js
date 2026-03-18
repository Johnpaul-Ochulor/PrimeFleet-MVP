import { Driver } from '../models/index.js';
import cloudinary from '../config/cloudinary.js';


export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { name, phone, licenseNumber } = req.body;
    let photoUrl = '';
    let licenseUrl = '';

    const uploadToCloudinary = async (file, folder) => {
      const fileBase64 = file.buffer.toString('base64');
      const fileUri = `data:${file.mimetype};base64,${fileBase64}`;
      const uploadRes = await cloudinary.uploader.upload(fileUri, { folder });
      return uploadRes.secure_url;
    };

    // Handling files from Multer (upload.fields)
    if (req.files?.photo) {
      // const res = await cloudinary.uploader.upload(req.files.photo[0].path, { folder: 'primefleet/drivers' });
      // photoUrl = res.secure_url;
      photoUrl = await uploadToCloudinary(req.files.photo[0], 'primefleet/drivers');
    }

    if (req.files?.licenseDocument) {
      // const res = await cloudinary.uploader.upload(req.files.licenseDocument[0].path, { folder: 'primefleet/licenses' });
      // licenseUrl = res.secure_url;
      licenseUrl = await uploadToCloudinary(req.files.licenseDocument[0], 'primefleet/licenses');
    }

    const driver = await Driver.create({
      name,
      phone,
      licenseNumber,
      profilePhotoUrl: photoUrl,
      licensePhotoUrl: licenseUrl
    });

    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await driver.update({ approvalStatus: true });

    res.json({
      success: true,
      message: "Driver approved",
      data: driver
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const suspendDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await driver.update({ isAvailable: false });

    res.json({
      success: true,
      message: "Driver suspended",
      data: driver
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await driver.update(req.body);

    res.json({
      success: true,
      message: "Driver updated",
      data: driver
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

