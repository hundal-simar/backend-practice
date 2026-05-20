const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');

const router = express.Router();

// create a project

router.post('/', async (req,res)=>{
    try{
        const project= new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// get all projects

router.get('/', async (req,res)=>{
    try{
        const projects= await Project.find().populate('owner', 'name email')
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// get project by id

router.get('/:id', async (req, res)=>{
    try{
        const project= await Project.findById(req.params.id).populate('owner', 'name email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// update project by id

router.put('/:id', async (req, res)=>{
    try{
        const {status, createdAt}= req.query
        if(status || createdAt){
            const projects= await Project.find(status ? {status}: { })
            .sort(createdAt ? {createdAt: createdAt === 'asc' ? 1 : -1} : {})
            .populate('owner', 'name email')
            return res.status(200).json(projects);
        }

        const project= await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// delete project by id

router.delete('/:id', async (req, res)=>{
    try{
        const project= await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports=router