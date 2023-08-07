import {Request, Response} from 'express'
import RegionesModel from '../models/Regiones'

export async function getRegions(req:Request, res:Response) {
    try{
        const Regions = await RegionesModel.findAll();

        res.status(200).send({Regions})
    }catch(error:any){
        console.log(error);
        res.status(500).send('ERROR_GETING_REGIONS')
    }
}