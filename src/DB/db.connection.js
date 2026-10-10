import chalk from "chalk";
import mongoose from "mongoose";

export const DBConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Mongoose_Assignment", {
            serverSelectionTimeoutMS: 5000,
        })
        console.log(chalk.green("DB connected successfully"));
    } catch (error) {
        console.log(chalk.red("Error connecting to MongoDB:"), error);
    }
}