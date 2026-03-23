import * as infoService from './info.service.js';

export const getAllInfos = async (req, res, next) => {
  try {
    const data = await infoService.getAllInformation();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getNewInfos = async (req, res, next) => {
  try {
    const data = await infoService.getNewInformation();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getInfoDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await infoService.getInformationById(id);
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Information not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createInfo = async (req, res, next) => {
  try {
    // Sesuaikan sama input yang masuk dari Postman
    const { title, body } = req.body; 
    
    // Safety check: Kalau middleware auth belum jalan, req.user bakal undefined
    const sender_id = req.user ? req.user.id : null; 

    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and body are required' 
      });
    }

    // Pastikan service-nya nerima object yang sesuai
    const newInfo = await infoService.createInformation({ 
      title, 
      body, 
      sender_id 
    });

    res.status(201).json({ success: true, data: newInfo });
  } catch (error) {
    next(error);
  }
};

export const deleteInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await infoService.deleteInformation(id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Information not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const data = await infoService.updateInformation(id, { title, body });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};