
import io from 'socket.io-client';
import { ClientInfo, ClientUsage } from '../Types';
import * as Config from './Config/main.json';
import { GetDisksStatus, GetSystemUsage, init } from './monitor';
import axios from 'axios';

(async () => {
    let Client: ClientInfo = {
        name: Config.name,
        system: await init(),
        user: {
            name: Config.user.name,
            passwd: Config.user.passwd
        }
    };

    console.log("Login...", Client.name);

    let ServerResponse = await axios.post(`http://kunrai.kro.kr:8898/Monitor/Login`, Client.user);
    Client.user.passwd = undefined;
    if (!ServerResponse.data.name) return console.log("LOGIN_FAIL", ServerResponse.data);
    Client.user = ServerResponse.data;

    console.log("Connecting to Server", Client.system.macaddr);

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
    })

    socket.on("Status", (bool: any) => {
        console.log("Status", bool);
    })

    socket.on("error", () => {
        console.log("error");
    })

})();



// const app = express();
// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));



// app.post('/Monitor/GetStatus', async (req, res) => {
//     let response: ClientUsage = {
//         ...GetSystemUsage(),
//         Drives: await GetDisksStatus()
//     }
//     res.send(response);
// })



// app.listen(8899, async() => {
//     // await axios.post('http://localhost:8898/Monitor/ServerStarted', system);
//     let ServerResponse = await axios.post(`http://192.168.1.71:8898/Monitor/Login`, Client.user);
//     Client.user.passwd = undefined;
//     if (ServerResponse.data.name) {
//         console.log('Collecting System Information');
//         Client.user = ServerResponse.data;
        
//         ServerResponse = await axios.post(`http://192.168.1.71:8898/Monitor/ServerLogin`, {ServerInfo: Client});
//         console.log(ServerResponse.data)
//     } else {
//         console.log("Login Failed, ServerResponse:", ServerResponse.data);
//         process.exit(1);
//     }
// })