import express from "express";
import axios from "axios";

const server = express();

server
    .use(express.json())

server.get("/ocean/:date", async (req, res) => {

    const { date } = req.params;

    if (!date) return res.sendStatus(400);

    try {
        const url = `https://simcosta.furg.br/api/oceanic_data?boiaID=12&type=json&time1=1673924400&time2=${date}&params=Hsig_Significant_Wave_Height_m,Mean_Wave_Direction_deg,TAvg,Average_Temperature_deg_C,Average_Temperature_C`;
        const promise = await axios.get(url);
        return res.status(200).send(promise.data);
    } catch (error) {
        console.error(error);
    }
})

server.get("/atmosphere/:date", async (req, res) => {

    const { date } = req.params;

    if (!date) return res.sendStatus(400);

    try {
        const url = `https://simcosta.furg.br/api/metereo_data?boiaID=3&type=json&time1=1674010800&time2=${date}&params=Average_wind_direction_N,Average_wind_speed,Average_Air_Temperature`;
        const promise = await axios.get(url);
        return res.status(200).send(promise.data);
    } catch (error) {
        console.error(error);
    }
})

server.listen(4001, () => console.log("Server listen on PORT 4001"));