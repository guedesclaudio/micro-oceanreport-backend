import express from "express";
import axios from "axios";
import cors from "cors";
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

const server = express();
server.use(cors());
server.use(express.json());
server.use(limiter);

// Ocean endpoint
server.get("/ocean/:date", async (req, res) => {

    const { date } = req.params;

    if (!date) return res.sendStatus(400);

    try {
        const url = `https://simcosta.furg.br/api/oceanic_data?boiaID=12&type=json&time1=1713927600&time2=${date}&params=Hsig_Significant_Wave_Height_m,Mean_Wave_Direction_deg,TAvg,Average_Temperature_deg_C,Average_Temperature_C`;
        const promise = await axios.get(url);
        const result = promise.data[promise.data.length - 1];
        return res.status(200).send([result]);
    } catch (error) {
        console.error(error);
    }
})

// Atmosphere endpoint
server.get("/atmosphere/:date", async (req, res) => {

    const { date } = req.params;

    if (!date) return res.sendStatus(400);

    try {
        const url = `https://simcosta.furg.br/api/metereo_data?boiaID=12&type=json&time1=1713927600&time2=${date}&params=Average_wind_direction_N,Average_wind_speed,Average_Air_Temperature`;
        const promise = await axios.get(url);
        const result = promise.data[promise.data.length - 1];
        return res.status(200).send([result]);
    } catch (error) {
        console.error(error);
    }
})

// Endpoint genérico: POST /proxy
server.post("/proxy", async (req, res) => {
  const before = Date.now();
  try {
    const { endpoint, method = "GET", headers = {}, body = {}, query = {} } = req.body;
    const info = { endpoint, method };
    const stringifyInfo = JSON.stringify(info);
    console.log(`[proxy] - Receiving request. Params: ${stringifyInfo}`);

    if (!endpoint) {
      const message = { error: "Missing 'endpoint' in body." };
      console.log(`[proxy] - ${JSON.stringify(message)}`);
      return res.status(400).json(message);
    }

    const baseUrl = "http://191.252.217.133:30081";
    const url = `${baseUrl}${endpoint}`;

    const response = await axios({
      url,
      method,
      headers,
      data: body,
      params: query,
      validateStatus: () => true,
    });
    const after = Date.now();
    const diff = after - before;
    console.log(`[proxy] - Request OK. Time: ${diff} ms. Params: ${stringifyInfo}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    const after = Date.now();
    const diff = after - before;
    console.error(`[proxy] - Time: ${diff} ms. Error:`, error.message);
    return res.status(500).json({ error: "Internal proxy error" });
  }
});

// Health check opcional
server.get("/health", (_, res) => res.json({ status: "ok" }));

server.listen(4001, () => {
  console.log(`Server listen on http://localhost:${4001}`);
});
