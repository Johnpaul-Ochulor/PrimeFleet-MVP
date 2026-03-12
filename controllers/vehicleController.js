import { prisma } from '../config/db.js';

export const createVehicle = async (req, res) => {

  const vehicle = await prisma.vehicle.create({
      data: {
        make: req.body.make,
        model: req.body.model,
        year: Number(req.body.year),
        plateNumber: req.body.plateNumber,
        vehicleType: req.body.vehicleType,
        pricePerDay: Number(req.body.pricePerDay),
        driverId: req.body.driverId,
        photoUrl: req.body.photoUrl,
        inspectionRecordUrl: req.body.inspectionRecordUrl
      }
    });

    res.status(201).json({
      success: true,
      data: vehicle
    });


};

export const getVehicle = async (req, res) => {
  try {

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: Number(req.params.id)
      },
      include: {
        driver: true
      }
    });

    res.json(vehicle);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicles = async (req, res) => {

  const vehicles = await prisma.vehicle.findMany({
    include: { driver: true }
  });

  res.json(vehicles);
};

export const updateVehicle = async (req, res) => {

  const vehicle = await prisma.vehicle.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });

  res.json(vehicle);
};

export const deleteVehicle = async (req, res) => {

  await prisma.vehicle.delete({
    where: { id: Number(req.params.id) }
  });

  res.json({ message: "Vehicle deleted" });
};