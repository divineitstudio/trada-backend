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

export const getNewInformation = async () => {
  try {
    const sevenDaysAgo = new Date();
    // Use setHours to ensure you are capturing the full range from the start of the day
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); 

    const result = await prisma.information.findMany({
      where: {
        created_at: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { created_at: 'desc' },
      include: {
        sender: {
          select: { username: true },
        },
      },
    });

    return result; // Critical: You need to return the data!
  } catch (error) {
    console.error("Error fetching new information:", error);
    throw error; // Or return an empty array [] depending on your error strategy
  }
};


 export const deleteInformation = async (id) => {
  return await prisma.information.delete({
    where: { id: parseInt(id) }
  });
};

export const updateInformation = async (id, data) => {
  return await prisma.information.update({
    where: { id: parseInt(id) },
    data: {
      title: data.title,
      body: data.body,
      sender_id: data.sender_id || null
    }
  });
};
