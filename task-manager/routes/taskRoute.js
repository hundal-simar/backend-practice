const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const isOwner = require('../middleware/isOwner');
const isMember = require('../middleware/isMember');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

const router = express.Router();

// create a task

router.post('/',protect, isMember, async (req, res)=>{
    try{
        const task= new Task(req.body)
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// get all tasks

router.get('/',protect, async (req,res)=>{
    try{
        const {status, priority, project, search, sort, page=1, limit=5}= req.query
        let filter={};
        if(status){
            filter.status=status
        }
        if(priority){
            filter.priority=priority
        }
        if(project){
            filter.project=project
        }
        if(search){
            filter.title={$regex: search, $options: 'i'}    
        }
        const tasks= await Task.find(filter)
        .sort(sort)
        .skip((page-1)*limit)
        .limit(limit)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// get task by id

router.get('/:id',protect, async (req, res)=>{
    try{
        const task= await Task.findById(req.params.id)
        .populate('project', 'name')
        .populate('assignedTo', 'name email');
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//update task by id

router.put('/:id',protect, isOwner, async (req, res)=>{
    try{
        const task= await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// delete task by id

router.delete('/:id',protect, restrictTo('admin'), async (req,res)=>{
    try{
        const task= await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router