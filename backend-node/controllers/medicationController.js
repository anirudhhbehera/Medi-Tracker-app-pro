import Medication from '../models/Medication.js';

export const getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.query.userId });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.query.userId });
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMedication = async (req, res) => {
  try {
    const medication = new Medication(req.body);
    const savedMedication = await medication.save();
    res.status(201).json(savedMedication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.query.userId },
      req.body,
      { new: true }
    );
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    res.json(medication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.query.userId });
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchMedications = async (req, res) => {
  try {
    const medications = await Medication.find({
      userId: req.query.userId,
      name: { $regex: req.query.query, $options: 'i' }
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockMedications = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 7;
    const medications = await Medication.find({
      userId: req.query.userId,
      stock: { $lte: threshold }
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.query.userId },
      { stock: req.query.stock },
      { new: true }
    );
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    res.json(medication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedicationStats = async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.query.userId });
    const lowStockMedications = medications.filter(m => m.stock <= 7);
    const totalStock = medications.reduce((sum, m) => sum + (m.stock || 0), 0);
    
    res.json({
      totalMedications: medications.length,
      lowStockCount: lowStockMedications.length,
      totalStock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
