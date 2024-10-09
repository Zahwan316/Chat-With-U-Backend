import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()

const sequelize = new Sequelize(process.env.DB_NAME as string,process.env.DB_USER as string,process.env.DB_PASSWORD as string,{
    dialect:"postgres",
    host:"localhost"
})

const start = async() => {
    try{
        await sequelize.authenticate()
        console.log("Connection success")
    }
    catch(e){
        console.error("unable to connect",e)
    }
}

console.log(process.env.DB_NAME)

start()

export default sequelize