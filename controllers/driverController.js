import { Driver } from '../models/index.js';
import cloudinary from '../config/cloudinary.js';

// 1. Get All Drivers (Item 4: No longer an empty shell)
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Single Driver (Item 4: Added)
export const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Onboard New Driver (Working Well - Cloudinary logic preserved)
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

    if (req.files?.photo) {
      photoUrl = await uploadToCloudinary(req.files.photo[0], 'primefleet/drivers');
    }

    if (req.files?.licenseDocument) {
      licenseUrl = await uploadToCloudinary(req.files.licenseDocument[0], 'primefleet/licenses');
    }

    const driver = await Driver.create({
      name,
      phone,
      licenseNumber,
      profilePhotoUrl: photoUrl,
      licensePhotoUrl: licenseUrl,
      status: 'PENDING' // Default status for new onboarding
    });

    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. Approve Driver (Item 4: Align with schema status values)
export const approveDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByPk(id);

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Using string-based status if your schema uses ENUMs like 'APPROVED'
    await driver.update({ status: 'APPROVED', isAvailable: true });

    res.json({ success: true, message: "Driver approved and marked available", data: driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Suspend Driver (Item 4: Align with schema status values)
export const suspendDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByPk(id);

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    await driver.update({ status: 'SUSPENDED', isAvailable: false });

    res.json({ success: true, message: "Driver suspended", data: driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Update Driver Details (Item 4: Required for Admin panel)
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByPk(id);

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    await driver.update(req.body);
    res.json({ success: true, message: "Driver updated", data: driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};