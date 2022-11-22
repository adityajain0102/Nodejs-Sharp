const errorHandler=(err,req,resp,next)=>{
    console.log(err.stack.red);

    resp.status(err.statusCode||500).json({status:false,message:err.message||'internal server Error'});

}

module.exports=errorHandler;