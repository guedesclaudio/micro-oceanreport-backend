import express from "express";
import axios from "axios";

const server = express();

server
    .use(express.json())

server.get("/waves", async (req, res) => {

    //const { date } = req.params;

    //if (!date) return res.sendStatus(400);

    try {
        const url = "https://simcosta.furg.br/api/oceanic_data?boiaID=12&type=json&time1=1673924400&time2=1674097200&params=Hsig_Significant_Wave_Height_m";
        const promise = await axios.get(url);
        return res.status(200).send(promise.data);
    } catch (error) {
        console.error(error);
    }
})

server.listen(4001, () => console.log("Server listen on PORT 4001"));