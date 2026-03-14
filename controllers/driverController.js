import { prisma } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to handle Cloudinary uploads from memory (Buffer)
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const createDriver = async (req, res) => {
  try {
    let profilePhotoUrl = null;
    let licensePhotoUrl = null;

    // 1. Handle Profile Photo Upload
    if (req.files?.photo) {
      const result = await uploadToCloudinary(req.files.photo[0].buffer, "drivers/profiles");
      profilePhotoUrl = result.secure_url;
    }

    // 2. Handle License Document Upload
    if (req.files?.licenseDocument) {
      const result = await uploadToCloudinary(req.files.licenseDocument[0].buffer, "drivers/licenses");
      licensePhotoUrl = result.secure_url;
    }

    // 3. Save to Database (Matching your Prisma Schema field names)
    const driver = await prisma.driver.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        licenseNumber: req.body.licenseNumber,
        profilePhotoUrl: profilePhotoUrl,
        licensePhotoUrl: licensePhotoUrl,
        isAvailable: req.body.isAvailable === 'false' ? false : true
      }
    });

    res.status(201).json({
      status: 'success',
      data: driver
    });

  } catch (error) {
    console.error("Driver Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { vehicles: true }
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDriver = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { 
        id: req.params.id // Removed Number() because Prisma uses UUID strings
      },
      include: { vehicles: true }
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};