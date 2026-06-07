const Project= require('../models/Project')

const isMember= async (req, res, next)=>{
    try{
        const project= await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if(project.role === 'admin' || project.role === 'moderator'){
            return next();
        }
        if(project.owner.toString() === req.user._id.toString()){
            return next();
        }
        if(!project.members.includes(req.user._id)){
            return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports= isMember;