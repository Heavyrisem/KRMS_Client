
import io from 'socket.io-client';
import { ClientInfo, ClientUsage } from '../Types';
import DeafultSetting from './Settings/KRMS_Default.json';
import Text from './KRMS_Text.json';
import { GetDisksStatus, GetSystemUsage, init } from './monitor';
import axios from 'axios';
import fs from 'fs';
import { Setting } from './Settings/Setting';

import Package from './package.json';

const CheckConfigFile = ():Promise<Setting> => {
    return new Promise(resolve => {
        fs.stat('./KRMS_Setting.json', (err, stats) => {
            if (err) {
                console.log("설정 파일이 존재하지 않습니다.", process.cwd(), "에 새로 생성합니다.");

                fs.writeFile('./KRMS_Setting.json', JSON.stringify(DeafultSetting, null, 4), () => {
                    console.log("설정 파일을 수정 후 다시 실행해 주세요. https://github.com/Heavyrisem/KRMS_Client/blob/master/README.md");
                    process.exit();
                });
            } else {
                fs.readFile('./KRMS_Setting.json', (err, data) => {
                    let Setting: Setting;
                    try {
                        Setting = JSON.parse(data.toString());
                        resolve(Setting);
                    } catch(err) {
                        console.log("JSON 파일을 읽는 중에 오류가 발생했습니다.", err);
                        process.exit();
                    }
                })
            }
        });
    });
}

(async () => {

    console.log("KRMS Client Version", Package.version);
    

    const Setting = await CheckConfigFile();
    let Client: ClientInfo | null = null;
    
    console.log(Text.SettingLoadSuccess[Setting.language]);
    console.log(Text.Agreement[Setting.language]);

    try {
        Client = {
            name: Setting.Server.Name,
            system: await init(),
            user: {
                name: Setting.Server.KRMS_Account.name,
                passwd: Setting.Server.KRMS_Account.passwd
            }
        };
    } catch(err) {
        console.log("설정값이 올바르지 않습니다.");
        process.exit();
    }

    if (!Client) return;

    console.log(Text.Login[Setting.language], Client.name);

    let ServerResponse = await axios.post(`http://kunrai.kro.kr:8898/Monitor/Login`, Client.user);
    Client.user.passwd = undefined;
    if (!ServerResponse.data.name) {
        console.log(Text.LoginFaild[Setting.language], ServerResponse.data);
        process.exit();
    }
    Client.user = ServerResponse.data;
    console.log(Text.ConnectingToServer[Setting.language], Client.system.macaddr);

    let socket = io('ws://kunrai.kro.kr:8898', {
        query: {
            data: JSON.stringify(Client)
        }
    });

    let Requester = setInterval(async () => {
        let Usage: ClientUsage = {
            ...GetSystemUsage(),
            Drives: await GetDisksStatus()
        }
        socket.emit("UsageUpdate", Usage);
    }, 30 * 1000);

    socket.on("Error", (Response: {msg: string}) => {
        console.log("ERR", Response.msg);
        process.exit();
    })

    socket.on("error", () => {
        console.log("error");
        process.exit();
    })
})();