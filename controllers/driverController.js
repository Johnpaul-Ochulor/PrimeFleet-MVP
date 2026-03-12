import { prisma } from "../config/db.js"; import cloudinary from "../config/cloudinary.js";

export const createDriver = async (req, res) => {
  try {

    let photoUrl = null;
    let licenseUrl = null;

    if (req.files?.photo) {
      const result = await cloudinary.uploader.upload(req.files.photo[0].path);
      photoUrl = result.secure_url;
    }

    if (req.files?.licenseDocument) {
      const result = await cloudinary.uploader.upload(req.files.licenseDocument[0].path);
      licenseUrl = result.secure_url;
    }

    const driver = await prisma.driver.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        licenseNumber: req.body.licenseNumber,
        licensePhotoUrl: req.body.licensePhotoUrl,
        profilePhotoUrl: req.body.profilePhotoUrl
      }
    });

    res.status(201).json(driver);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDrivers = async (req, res) => {

  const drivers = await prisma.driver.findMany({
    include: { vehicles: true }
  });

  res.json(drivers);
};

export const getDriver = async (req, res) => {

  const driver = await prisma.driver.findUnique({
    where: { id: Number(req.params.id) },
    include: { vehicles: true }
  });

  res.json(driver);
};

export const updateDriver = async (req, res) => {

  const driver = await prisma.driver.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });

  res.json(driver);
};

export const deleteDriver = async (req, res) => {

  await prisma.driver.delete({
    where: { id: Number(req.params.id) }
  });

  res.json({ message: "Driver deleted" });
};