import prisma from '../client';

const createDefects = async (
  inspectionId: string,
  damages: any[]
) => {

  return prisma.itemDefect.createMany({
    data: damages.map(
      damage => ({
        inspectionId,

        defectType:
          damage.type,

        confidence:
          damage.confidence,

        severity:
          damage.damagePercentage ?? 0
      })
    )
  });
};

export default {
  createDefects
};