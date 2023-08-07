import { Request, Response } from "express";
import { matchedData } from "express-validator";
import handleHttpErrors from '../utils/handleErrors';
import TiendaModel  from "../models/Tiendas";
import ClienteModel from "../models/Clientes";
import TiendasRegionesModel from "../models/Tiendas_regiones";


export const tiendaRegister = async (req:Request, res:Response) =>{ 
    try{
        //retorna solo los valores validados por el middleware (validatorRegisterTienda)
        const dataTienda = matchedData(req);
        let { RIF,  cliente_id, nombre, descripcion, imagen} = dataTienda;

        //validar que el cliente exista
        const client = await ClienteModel.findOne({ where: { id: cliente_id } });
        if (!client) return res.status(400).send('El cliente con el cliente_id proporcionado no existe');
        
        //validar si el RIf de tienda Existe
        const tienda = await TiendaModel.findOne({ where: { RIF } });
        if (tienda) return res.status(400).send('Tienda ya registrada, ingrese otro RIF');

        const status = '0'; //En espera de aprobacion
        const saldo = 0;

        //imagen enviada por el midleware anterior (uploadMiddleware)
        imagen = req.body.imagen.trim(); 

        // crea la tienda
        const newTienda = await TiendaModel.create({
            RIF,
            nombre, 
            imagen,
            status,
            cliente_id, 
            descripcion,
            saldo
        })
        if(!newTienda) return res.status(400).send('ERROR_CREATING_TIENDA');


        //crea objeto de regiones y tiendas que se van a guardar en la tabla tiendas_regiones
        const regiones_id:Array<number> = dataTienda.region_id;
        const regionesPerTienda = regiones_id.map((region_id:number)=>{
            return{
                tienda_id: newTienda.RIF,
                region_id
            }
        })
        TiendasRegionesModel.bulkCreate(regionesPerTienda)
        

        res.status(200).send({
            tienda: newTienda,
            id_regiones: regiones_id  
        })
    }catch(error:any){
        console.log(error);
        handleHttpErrors(error);
    }
}


export const getTiendas = async (req:Request, res:Response) =>{ 
    try{
        const { page = 0, size = 10 } = req.query;

        let options = {
            limit: +size,
            offset: +page * +size,
        };

        const { count, rows } = await TiendaModel.findAndCountAll(options);
        res.send({ total: count, tiendas: rows });
    }catch(error:any){
        console.log(error);
        handleHttpErrors(error);
    }
}


export const getTiendaByRIF = async (req:Request, res:Response) =>{ 
    try{
        const { tiendaRIF } = req.params;
        //validar que el tiendaRIF no sea un string
        if(!parseInt(tiendaRIF)) return res.status(505).send('RIF_CAN_NOT_BE_A_STRING')

        const tienda_rif = parseInt(tiendaRIF);
		const data = await TiendaModel.prototype.findTiendaByRIF(tienda_rif);
		res.send({ data });
    }catch(error:any){
        console.log(error);
        handleHttpErrors(error);
    }
}


export const getTiendaByName = async (req:Request, res:Response) =>{ 
    try{
        const { tiendaName } = req.params;
		const data = await TiendaModel.prototype.findTiendaByName(tiendaName);
		res.send({ data });
    }catch(error:any){
        console.log(error);
        handleHttpErrors(error);
    }
}


export const getTiendaByClient = async (req:Request, res:Response) =>{ 
    try{
        let { clientID } = req.params;

        //validar que el clientID no sea un string
        if(!parseInt(clientID)) return res.send('CLIENT_ID_CAN_NOT_BE_A_STRING');
        
        const client_id = parseInt(clientID);
		const data = await TiendaModel.prototype.findTiendaByClient(client_id);
		res.send({ data });
    }catch(error:any){
        console.log(error);
        handleHttpErrors(error);
    }
}
