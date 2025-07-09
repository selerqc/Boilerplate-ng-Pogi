import app from "./src/app.js";
import config from "./src/utils/config.js";


app.listen(config.PORT, config.HOST, () => {

  console.log(`Server is running on port http://${config.HOST}:${config.PORT}/api/any`);
});