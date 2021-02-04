import * as osutill from 'os-utils';
import * as os from 'os';
import * as getmac from 'getmac';
import * as drivelist from 'drivelist';
import * as Config from './Config/main.json';
const diskfree = require('diskfree');

import { Drive, System, SystemUsage } from '../Types';

let system: System = {
    memory: 0,
    cpu: {
        arch: os.arch(),
        coreCount: 0,
        name: ''
    },
    Drives: [],
    platform: os.platform(),
    os: os.version(),
    osversion: os.release(),
    macaddr: ''
};


const GetDriveFreeSize = (path: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        diskfree.check(path, (err: any, info: any) => {
            if (err) return reject(err);
            return resolve(info.free);
        })
    })
}

const SystemInfo = (): Promise<System> => {
    return new Promise(async (resolve, reject) => {

        system.memory = os.totalmem();

        let cores = os.cpus();
        system.cpu.name = cores[0].model;
        system.cpu.coreCount = cores.length;

        let drives = await drivelist.list();
        for (const drive of drives) {
            if (!drive.mountpoints.length) continue;
            system.Drives.push({
                name: drive.description,
                size: drive.size,
                freesize: await GetDriveFreeSize(drive.mountpoints[0].path),
                mount: drive.mountpoints[drive.mountpoints.length-1].path
            });
        }


        let networkinterfaces: any = os.networkInterfaces();
        let keys = Object.keys(networkinterfaces);

        // system.macaddr = networkinterfaces[keys[0]][0].mac;
        system.macaddr = getmac.default();
        // system.macaddr = 'FakeServer';

        resolve(system);
    })
}


let cpuusage: Array<number> = [];
let memusage: Array<number> = [];
const MonitorSystemUsage = (CollectInterval: number): NodeJS.Timeout => {
    return setInterval(() => {
        memusage.push(1 - osutill.freememPercentage());

        osutill.cpuUsage(v => {
            cpuusage.push(v);
        })

        if (memusage.length >= 500) memusage.shift();
        if (cpuusage.length >= 500) cpuusage.shift();
    }, CollectInterval * 1000);
}

export const GetDisksStatus = (): Promise<Array<Drive>> => {
    return new Promise(async resolve => {
        let result: Array<Drive> = [];
        for (const Drive of system.Drives) {
            result.push({
                ...Drive,
                freesize: await GetDriveFreeSize(Drive.mount)
            });
        }
        resolve(result);
    })
}

export const GetSystemUsage = (): SystemUsage => {
    let systemusage: SystemUsage = {
        cpu: 0,
        memory: 0
    };
    if (!(cpuusage.length && memusage.length)) return systemusage;

    let tmp = 0;
    for (const v of cpuusage) {
        tmp += v;
    }
    systemusage.cpu = tmp / cpuusage.length;
    cpuusage = [];

    tmp = 0;
    for (const v of memusage) {
        tmp += v;
    }
    systemusage.memory = tmp / memusage.length;
    memusage = [];


    return systemusage;
}


export const init = (): Promise<System> => {
    return new Promise(async resolve => {
        MonitorSystemUsage(2);

        resolve(await SystemInfo());
    });
}