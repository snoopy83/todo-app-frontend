import React, { useState, useEffect } from "react"

const TodoList = (props) => {

    const { emitDeleteTodoList, showTodoList } = props
    const [todoList, setTodoList] = useState(props.data)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        if (isDirty) {
            fetch(`http://localhost:8080/api/todoLists/${todoList.id}`, {
                method: 'PUT',
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify(todoList)
            }).then(response => response.json()).then(data => {
                setIsDirty(false)
                setTodoList(data)
            })
        }


        console.log("todoList changed:", todoList)
    }, [todoList, isDirty])

    const showList = (e) => {
        showTodoList(e.target.value)

    }

    const updateTitle = (e) => {
        setIsDirty(true)
        setTodoList({ ...todoList, title: e.target.value })
        // console.log(todoList.task)
    }

    const deleteTodoList = (e) => {
        fetch(`http://localhost:8080/api/todoLists/${todoList.id}`, {
            method: 'DELETE',
            headers: {
                'content-type': "application/json"
            }
        }).then(response => {
            response.json()
        }).then(data => {
            emitDeleteTodoList(todoList)
        })
    }



    return (
        <div>
            <input
                type="radio"
                value={todoList.id}
                name="todoList"
                onChange={showList} />

            {
                todoList.isDone ? <span>{todoList.title} Finished!</span> : <input type='text' value={todoList.title} onChange={updateTitle}></input>
            }
            <span style={{ marginLeft: '0.5rem', cursor: "pointer" }} onClick={deleteTodoList}>❌</span>
        </div>
    )
}

export default TodoList