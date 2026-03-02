import prisma from '../../config/prisma.js';

export const getAllInformation = async () => {
  const result = await prisma.information.findMany({
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

export const getInformationById = async (id) => {
  const info = await prisma.information.findUnique({
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

export const createInformation = async (data) => {
  return await prisma.information.create({
    data: {
      title: data.title,
      body: data.body, // Sesuai nama kolom di schema.prisma
      sender_id: data.sender_id || null // Kalau 0, Prisma PostgreSQL bisa error FK
    }
  });
};