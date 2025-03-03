// app/lib/modules.ts
import  prisma  from "@/lib/prisma";

export async function getAllModules() {
  try {
    return await prisma.module.findMany({
      include: {
        subModules: true,
      },
      orderBy: {
        number: 'asc',
      },
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw new Error("Failed to fetch modules");
  }
}

export async function getUserModules(userId: string) {
  try {
    return await prisma.userModule.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        module: {
          include: {
            subModules: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user modules:", error);
    throw new Error("Failed to fetch user modules");
  }
}

export async function toggleUserModule(userId: string, moduleId: string) {
  try {
    // Check if user module association exists
    const existingUserModule = await prisma.userModule.findFirst({
      where: {
        userId,
        moduleId,
      },
    });

    if (existingUserModule) {
      // Toggle active status
      return await prisma.userModule.update({
        where: {
          id: existingUserModule.id,
        },
        data: {
          isActive: !existingUserModule.isActive,
        },
      });
    } else {
      // Create new association
      return await prisma.userModule.create({
        data: {
          userId,
          moduleId,
          isActive: true,
        },
      });
    }
  } catch (error) {
    console.error("Error toggling module selection:", error);
    throw new Error("Failed to update module selection");
  }
}