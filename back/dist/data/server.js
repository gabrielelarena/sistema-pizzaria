import express from 'express';
import cors from 'cors';
import router from '../routes/routes.js';
import routerprod from '../routes/produtos.js';
import routhercons from '../routes/cons.js';
import routherpreco from '../routes/precos.js';
import routherverif from '../routes/verificacd.js';
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(router);
app.use(routerprod);
app.use(routhercons);
app.use(routherpreco);
app.use(routherverif);
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map