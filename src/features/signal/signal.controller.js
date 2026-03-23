import * as signalService from './signal.service.js';

export const getSignals = async (req, res, next) => {
  try {
    const data = await signalService.getAllSignal();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMySignals = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null; // Pastikan middleware auth sudah jalan
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const data = await signalService.getSignalsByUserId(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSignalbySender = async (req, res, next) => {
  try {
    const { sender_id } = req.params;
    const data = await signalService.getSignalsByUserId(sender_id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSignalDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await signalService.getSignalById(id);
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Signal not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSignal = async (req, res, next) => {
  try {
    // Sesuaikan sama input yang masuk dari Postman
    const { symbol, type, entry_price, sl_price, tp_price, status } = req.body;
    
    // Safety check: Kalau middleware auth belum jalan, req.user bakal undefined
    const sender_id = req.user ? req.user.id : null; 

    if (!symbol || !type || !entry_price) {
      return res.status(400).json({ success: false, message: 'symbol, type, and entry_price are required' });
    }

    

    // Pastikan service-nya nerima object yang sesuai
    const newSignal = await signalService.createSignal({ 
      symbol,
      type,
      entry_price,
      sl_price,
      tp_price,
      status,
      sender_id 
    });

    res.status(201).json({ success: true, data: newSignal });
  } catch (error) {
    next(error);
  }
};

export const updateSignal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { symbol_id, type, entry_price, sl_price, tp_price, status } = req.body;
    const updatedSignal = await signalService.updateSignal(id, {
      symbol_id,
      type,
        entry_price,
        sl_price,
        tp_price,
        status
    }); 

    res.status(200).json({ success: true, data: updatedSignal });
    } catch (error) {
    next(error);
  } 
};

export const deleteSignal = async (req, res, next) => {
  try {
    const { id } = req.params;
    await signalService.deleteSignal(id);
    res.status(200).json({ success: true, message: 'Signal deleted successfully' });
  } catch (error) {
    next(error);
  }
};