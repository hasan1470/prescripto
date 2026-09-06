import app from "./server.js";
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Prescripto API listening on http://localhost:${port}`));
