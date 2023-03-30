import prisma from "@databases/postgresClient"

class LotService {
    
    public async getLot(lotID: number) {
        const results = await prisma.$queryRaw`SELECT * FROM lots`;
        return results;
    }
    public async getLots() {
        const results = await prisma.$queryRaw`SELECT * FROM lots`;
        console.log(results);
        return results;
    }
}

export default LotService;