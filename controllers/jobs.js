const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,NotFoundError} = require('../errors');


const getalljobs = async (req,res)=>{
    const jobs = await Job.find({createdby:req.user.userid}).sort('createdat');
    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}
const getjob = async (req,res)=>{
    //const {user:{userid},params:{id:jobid}} = req;
    const jobid = req.params.id;
    const userid = req.user.userid;
    const job = await Job.findOne({_id:jobid,createdby:userid});
    if(!job){
        throw new NotFoundError(`no job with id ${jobid}`)
    }
    res.status(StatusCodes.OK).json({job});
}
const createjob = async (req,res)=>{
    req.body.createdby = req.user.userid;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
    //res.json(req.user.userid)
}
const updatejob = async (req,res)=>{
    const {
        body:{company,position},
        user:{userid},
        params:{id:jobid},
    } = req;
    if(company === '' || position === ''){
        throw new BadRequestError('company or position fields cannot be empty');
    }
    const job = await Job.findByIdAndUpdate(
        {_id:jobid,createdby:userid},
        req.body,
        {new:true,runValidators:true}
    )
    if(!job){
        throw new NotFoundError(`no job with id ${jobid}`);
    }
    res.status(StatusCodes.OK).json({job});
}
const deletejob = async (req,res)=>{
    const {
        user:{userid},
        params:{id:jobid}
    } = req;
    const job = await Job.findByIdAndRemove({_id:jobid,createdby:userid});
    if(!job){
        throw new NotFoundError(`no job with id ${jobid}`);
    }
    res.status(StatusCodes.OK).send();
}


module.exports = {
    getalljobs,
    getjob,
    createjob,
    updatejob,
    deletejob
}