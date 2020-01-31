/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Backup } from './backup';

export class FabBackup extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const backups: Backup[] = [
            {
                backupTitle: '01',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
            {
                backupTitle: '02',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image 1',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
            {
                backupTitle: '03',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image 2',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
            {
                backupTitle: '04',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image 3',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
            {
                backupTitle: '05',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image 4',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
            {
                backupTitle: '06',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image 5',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
            {
                backupTitle: '07',
                fileHash: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
                filePath: 'test/path',
                fileName: 'Reddit Image 6',
                backupDateTime: 'Fri Jan 31 2020 09:43:47 GMT+0530 (India Standard Time)'
            },
        ];

        for (let i = 0; i < backups.length; i++) {
            backups[i].docType = 'backup';
            await ctx.stub.putState('ELAN' + i, Buffer.from(JSON.stringify(backups[i])));
            console.info('Added <--> ', backups[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryBackup(ctx: Context, backupID: string): Promise<string> {
        const backupAsBytes = await ctx.stub.getState(backupID); // get the backup from chaincode state
        if (!backupAsBytes || backupAsBytes.length === 0) {
            throw new Error(`${backupID} does not exist`);
        }
        console.log(backupAsBytes.toString());
        return backupAsBytes.toString();
    }

    public async createBackup(ctx: Context, backupID: string, backupTitle: string, fileHash: string, filePath: string, fileName: string, backupDateTime: string) {
        console.info('============= START : Create Backup ===========');

        const backup: Backup = {
            docType: 'backup',
            backupTitle,
            filePath,
            fileName,
            backupDateTime,
            fileHash
        };

        await ctx.stub.putState(backupID, Buffer.from(JSON.stringify(backup)));
        console.info('============= END : Create Backup ===========');
    }

    public async queryAllBackups(ctx: Context): Promise<string> {
        const startKey = 'ELAN0';
        const endKey = 'ELAN999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                // var jsonRes;
                // try {
                //     jsonRes = JSON.stringify(allResults);
                // } catch (error) {
                //     throw error;
                // }
                return JSON.stringify(allResults);
            }
        }
    }

    // public async changeCarOwner(ctx: Context, carNumber: string, newOwner: string) {
    //     console.info('============= START : changeCarOwner ===========');

    //     const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
    //     if (!carAsBytes || carAsBytes.length === 0) {
    //         throw new Error(`${carNumber} does not exist`);
    //     }
    //     const car: Car = JSON.parse(carAsBytes.toString());
    //     car.owner = newOwner;

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : changeCarOwner ===========');
    // }

}
