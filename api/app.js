const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const { List, Task} = require('./db/models');

app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/* ROUTE HANDLERS */

/*LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    List.find().then((lists) =>{
        res.send(lists);
    }).catch((e) =>{
        res.send(e);
    });
    
})

/**
 * POST /lists
 * Purpose: Create a list*/
app.post('/lists', (req,res) => {
    // We want to create a new list and return the new list document back to the user (which includes the id)
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })
 });

app.patch('/lists/:id',(req,res) => {
    List.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

app.delete('/lists/:id', (req,res) =>{
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});


/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // We want to create a new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
    // List.findOne({
    //     _id: req.params.listId,
    //     _userId: req.user_id
    // }).then((list) => {
    //     if (list) {
    //         // list object with the specified conditions was found
    //         // therefore the currently authenticated user can create new tasks
    //         return true;
    //     }

    //     // else - the list object is undefined
    //     return false;
    // }).then((canCreateTask) => {
    //     if (canCreateTask) {
    //         let newTask = new Task({
    //             title: req.body.title,
    //             _listId: req.params.listId
    //         });
    //         newTask.save().then((newTaskDoc) => {
    //             res.send(newTaskDoc);
    //         })
    //     } else {
    //         res.sendStatus(404);
    //     }
    // })
})

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task (specified by taskId)

    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    },  {
            $set: req.body
         }
    ).then(() => {
        res.sendStatus(200);
    })
//     List.findOne({
//         _id: req.params.listId,
//         _userId: req.user_id
//     }).then((list) => {
//         if (list) {
//             // list object with the specified conditions was found
//             // therefore the currently authenticated user can make updates to tasks within this list
//             return true;
//         }

//         // else - the list object is undefined
//         return false;
//     }).then((canUpdateTasks) => {
//         if (canUpdateTasks) {
//             // the currently authenticated user can update tasks
//             Task.findOneAndUpdate({
//                 _id: req.params.taskId,
//                 _listId: req.params.listId
//             }, {
//                     $set: req.body
//                 }
//             ).then(() => {
//                 res.send({ message: 'Updated successfully.' })
//             })
//         } else {
//             res.sendStatus(404);
//         }
//     })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {

    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
//     List.findOne({
//         _id: req.params.listId,
//         _userId: req.user_id
//     }).then((list) => {
//         if (list) {
//             // list object with the specified conditions was found
//             // therefore the currently authenticated user can make updates to tasks within this list
//             return true;
//         }

//         // else - the list object is undefined
//         return false;
//     }).then((canDeleteTasks) => {
        
//         if (canDeleteTasks) {
//             Task.findOneAndRemove({
//                 _id: req.params.taskId,
//                 _listId: req.params.listId
//             }).then((removedTaskDoc) => {
//                 res.send(removedTaskDoc);
//             })
//         } else {
//             res.sendStatus(404);
//         }
//     });
});



app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})