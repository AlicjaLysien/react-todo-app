import React from 'react';
import Task from './Task';
import Button from 'react-bootstrap/Button';

class Todo extends React.Component {

    state = {
        tasks: [],
        inputTask: '',
        lastId: 0,
        lastOrder: 0,
        inputLenght: 0,
        buttonHide: "Hide finished tasks",
        buttonShow: "Show finished tasks",
        buttonFinishedTasks: true,
        dragID: ''
    }

    componentDidMount() {
        if (localStorage.getItem('tasks') == null) {
            this.setState({ tasks: [] });
        } else {
            const tasks = localStorage.getItem('tasks')
            const lastId = localStorage.getItem('lastId')
            this.setState({ tasks: JSON.parse(tasks) })
            this.setState({ lastId: JSON.parse(lastId) })
        }
    }

    sendToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.state.tasks))
        localStorage.setItem('lastId', JSON.stringify(this.state.lastId))
        localStorage.setItem('lastOrder', JSON.stringify(this.state.lastOrder))
    }

    async addTask() {
        var letters = /^[A-Za-z0-9\s\W]+$/;
        if (this.state.inputTask.match(letters)) {
            const task = {
                id: this.state.lastId,
                order: this.state.lastOrder,
                finished: false,
                name: this.state.inputTask,
                addTime: new Date().toLocaleString()
            }
            const tasks = [task, ...this.state.tasks]
            const lastId = this.state.lastId + 1
            const lastOrder = this.state.lastOrder + 1
            await this.setState({ tasks: tasks })
            await this.setState({ inputTask: '' })
            await this.setState({ inputLenght: 0 })
            await this.setState({ lastId: lastId })
            await this.setState({ lastOrder: lastOrder })
            this.sendToLocalStorage()
        }
        else {
            alert("You use not allowed characters.");
        }
    }

    inputHandler(event) {
        const text = event.target.value
        this.setState({ inputTask: text })
        this.setState({ inputLenght: text.split("").length })
    }

    finishTask(id) {
        const index = this.state.tasks.findIndex(i => i.id == id)
        this.endFinishTask(index)
    }

    finishTaskForm() {
        const dragId = this.state.dragId
        const index = this.state.tasks.findIndex(i => i.id == dragId)
        this.endFinishTask(index)
    }

    async endFinishTask(index) {
        const tasks = this.state.tasks
        tasks[index].finished = true
        tasks[index].finishTime = new Date().toLocaleString()
        await this.setState({ tasks: tasks })
        this.sendToLocalStorage()
    }

    async changeTask(id, newName) {
        var letters = /^[A-Za-z0-9\s\W]+$/;
        if (newName.match(letters)) {
            const index = this.state.tasks.findIndex(i => i.id === id)
            const tasks = this.state.tasks
            tasks[index].name = newName
            await this.setState({ tasks: tasks })
            this.sendToLocalStorage()
        }
        else {
            alert("You use not allowed characters.");
        }
    }

    async removeTask(id) {
        const index = this.state.tasks.findIndex(i => i.id === id)
        const tasks = this.state.tasks
        tasks.splice(index, 1);
        await this.setState({ tasks: tasks })
        this.sendToLocalStorage()
    }

    buttonTasksHandler() {
        this.setState({ buttonFinishedTasks: !this.state.buttonFinishedTasks })
    }

    orderTasks(event) {
        const order = event.target.value

        const tasks = this.state.tasks
        if (order == "abc") {
            tasks.sort(function (a, b) {
                var A = a.name
                var B = b.name
                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            });
        }
        if (order == "time") {
            tasks.sort(function (a, b) {
                var A = a.addTime
                var B = b.addTime
                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            });
        }
        if (order == "random") {
            tasks.sort(func);
            function func() {
                return 0.5 - Math.random();
            }
        }
        for (var i = 0; i < tasks.length; i++) {
            tasks[i].order = i;
        }
        this.setState({ tasks: tasks })
    }

    handleDrag(id) {
        this.setState({ dragId: id })
    }

    async handleDrop(dropId) {
        const dragId = this.state.dragId
        const tasks = this.state.tasks
        const dragTask = tasks.findIndex(i => i.id == dragId);
        const dropTask = tasks.findIndex(i => i.id == dropId);
        console.log(dragTask)
        console.log(dropTask)
        const dropTaskOrder = this.state.tasks[dropTask].order
        const dragTaskOrder = this.state.tasks[dragTask].order
        tasks[dragTask].order = dropTaskOrder
        tasks[dropTask].order = dragTaskOrder

        tasks.sort(function (a, b) {
            var A = a.order
            var B = b.order
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        })

        await this.setState({ tasks: tasks })
        this.sendToLocalStorage()
    }


    render() {

        const tasksUnfinished = this.state.tasks.map(task => {
            if (!task.finished) {
                return <Task task={task}
                    handleDrag={this.handleDrag.bind(this)}
                    handleDrop={this.handleDrop.bind(this)}
                    finishTask={this.finishTask.bind(this)}
                    removeTask={this.removeTask.bind(this)}
                    changeTask={this.changeTask.bind(this)}
                />
            }
        });

        const tasksFinished = this.state.tasks.map(task => {
            if (task.finished) {
                return <Task task={task}
                    handleDrag={this.handleDrag.bind(this)}
                    handleDrop={this.handleDrop.bind(this)}
                    removeTask={this.removeTask.bind(this)}
                    changeTask={this.changeTask.bind(this)}
                />
            }
        })

        return (
            <div className="container-fluid">
                <h1>Todo app</h1>
                <div className="addItem">
                    <input type="text"
                        className={this.state.inputLenght == 128 ? 'lenght' : ''}
                        value={this.state.inputTask}
                        required maxLength={128}
                        onChange={this.inputHandler.bind(this)} />
                    <Button variant="success" onClick={this.addTask.bind(this)}>Add</Button>
                    <p>Left characters: {128 - this.state.inputLenght}</p>
                </div>

                <div className="orderItem">
                    <label for="order">Order Tasks:</label>
                    <select onChange={this.orderTasks.bind(this)} name="order" id="order">
                        <option value="time">By add time</option>
                        <option value="abc">Alfabatically</option>
                        <option value="random">Random</option>
                    </select>
                </div>

                <div className="notFinishedTasks">
                    {tasksUnfinished}
                </div>

                <div className="formForFinishTask"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={this.finishTaskForm.bind(this)} >
                    Drop here to make task finished.
                </div>

                <div className="finishedTasks">
                    <Button variant="success" onClick={this.buttonTasksHandler.bind(this)}>
                        {this.state.buttonFinishedTasks ? this.state.buttonHide : this.state.buttonShow}
                    </Button>
                    <div className={`finishedList ${!this.state.buttonFinishedTasks ? 'hideList' : ''}`}>
                        <h3>Finished</h3>
                        {tasksFinished}
                    </div>
                </div>
            </div>
        )
    }
}

export default Todo;