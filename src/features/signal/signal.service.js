import prisma from '../../config/prisma.js';

export const getAllSignal = async () => {
  const result = await prisma.signal.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      sender: {
        select: { username: true }
      }
    }
  });

  // Mapping: Kalau sender null, ganti username jadi 'System'
  return result.map((info) => ({
    ...info,
    sender: info.sender ? info.sender.username : 'System'
  }));
};

export const getSignalsByUserId = async (userId) => {
  const result = await prisma.signal.findMany({
    where: { sender_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      sender: {
        select: { username: true }
      }
    }
  });

  // Mapping: Kalau sender null, ganti username jadi 'System'
  return result.map((info) => ({
    ...info,
    sender: info.sender ? info.sender.username : 'System'
  }));
};

export const getSignalById = async (id) => {
  const info = await prisma.signal.findUnique({
    where: { id: parseInt(id) },
    include: {
      sender: {
        select: { username: true }
      }
    }
  });

  if (!info) return null;

  // Mapping untuk satu data
  return {
    ...info,
    sender: info.sender ? info.sender.username : 'System'
  };
};

export const createSignal = async (data) => {
  return await prisma.signal.create({
    data: {
        id: undefined, // Biarkan Prisma yang generate ID
      symbol: data.symbol, // Ganti dari symbol_id ke symbol (string)
      type: data.type,
      entry_price: data.entry_price,
      sl_price: data.sl_price,
      tp_price: data.tp_price,
      status: data.status || 'active',
      sender_id: data.sender_id || null // Kalau 0, Prisma PostgreSQL bisa error FK
    }
  });
};

export const updateSignal = async (id, data) => {
  return await prisma.signal.update({
    where: { id: parseInt(id) },
    data: {
      symbol: data.symbol, // Ganti dari symbol_id ke symbol (string)
      type: data.type,
        entry_price: data.entry_price,
        sl_price: data.sl_price,
        tp_price: data.tp_price,
        status: data.status
    }
  });
};

export const deleteSignal = async (id) => {
  return await prisma.signal.delete({
    where: { id: parseInt(id) }
  });
};