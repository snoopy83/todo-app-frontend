import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TodoItem = (props) => {

    const { emitDeleteTodoItem, listId } = props
    const [todoItem, setTodoItem] = useState(props.data)
    const [isDirty, setIsDirty] = useState(false)

    const [startDate, setStartDate] = useState(new Date(todoItem.dueDate));

    useEffect(() => {
        if (isDirty) {
            fetch(`http://localhost:8080/api/todoItems/${listId}/${todoItem.id}`, {
                method: 'PUT',
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify(todoItem)
            }).then(response => response.json()).then(data => {
                setIsDirty(false)
                setTodoItem(data)
                setStartDate(new Date(data.dueDate))
            })
        }


        console.log("todoItem changed:", todoItem)
    }, [todoItem, isDirty])

    const updateIsDone = () => {
        setIsDirty(true)
        setTodoItem({ ...todoItem, isDone: !todoItem.isDone })

    }

    const updateTask = (e) => {
        setIsDirty(true)
        setTodoItem({ ...todoItem, task: e.target.value })
        // console.log(todoItem.task)
    }

    const deleteTodoItem = (e) => {
        fetch(`http://localhost:8080/api/todoItems/${listId}/${todoItem.id}`, {
            method: 'DELETE',
            headers: {
                'content-type': "application/json"
            }
        }).then(response => {
            response.json()
        }).then(data => {
            emitDeleteTodoItem(todoItem)
        })
    }

    const changeDueDate = (date) => {
        setStartDate(date)
        setIsDirty(true)
        setTodoItem({ ...todoItem, dueDate: date })
    }

    return (
        <div className="container">
            <input
                type="checkbox"
                checked={todoItem.isDone}
                onChange={updateIsDone} />
            {
                todoItem.isDone ?
                    <span style={{ textDecoration: "line-through" }}>{todoItem.task}</span> :
                    <div className="container"><input type='text' value={todoItem.task} onChange={updateTask} style={{ color: todoItem.isDue?'red':'black'}}></input> <DatePicker selected={startDate} onChange={changeDueDate} /></div>
            }
            <span style={{ marginLeft: '0.5rem', cursor: "pointer" }} onClick={deleteTodoItem}>❌</span>
        </div>
    )
}

export default TodoItem