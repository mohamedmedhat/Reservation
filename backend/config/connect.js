import mongoose from "mongoose";

const mongoDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to Db :)");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default mongoDb;
