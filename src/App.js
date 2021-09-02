import './App.css';
import { useEffect, useState, Fragment } from "react"
import TodoItem from "./components/todoItem"
import TodoList from "./components/todoList"

function App() {

  const [todoItems, setTodoItems] = useState([]);

  const [todoLists, setTodoLists] = useState(null);

  const [showList, setShowList] = useState(false);

  const [selectedListId, setSelectedListId] = useState(0);

  // useEffect(() => {

  //   console.log("test")
  //   if (!todoItems) {
  //     fetch('http://localhost:8080/api/todoItems').then((response) => {
  //       return response.json()
  //     }).then(data => {
  //       console.log("to do list", data)
  //       setTodoItems(data)
  //     })
  //   }


  // }, [todoItems]);

  const addNewTodoItem = () => {
    fetch(`http://localhost:8080/api/todoItems/${selectedListId}`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      //body: JSON.stringify(request)
    }).then(response => response.json()).then(aTodoItem => {
      console.log(aTodoItem)
      setTodoItems([...todoItems, aTodoItem])

    })
  }

  const handleDeleteTodoItem = (item) => {
    const updateTodoItems = todoItems.filter(aTodoItem => aTodoItem.id !== item.id)
    setTodoItems([...updateTodoItems])
  }

  ///////////////////////////////////////////////////

  useEffect(() => {

    console.log("add list")
    if (!todoLists) {
      fetch('http://localhost:8080/api/todoLists').then((response) => {
        return response.json()
      }).then(data => {

        setTodoLists(data)
      })
    }
  }, [todoLists]);

  const addNewList = () => {
    fetch('http://localhost:8080/api/todoLists', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      //body: JSON.stringify(request)
    }).then(response => response.json()).then(aTodoList => {
      console.log(aTodoList)
      setTodoLists([...todoLists, aTodoList])

    })
  }

  const handleDeleteTodoList = (list) => {
    const updateTodoLists = todoLists.filter(aTodoList => aTodoList.id !== list.id)
    setTodoLists([...updateTodoLists])

    if (list.id+""===selectedListId){
      setTodoItems([])
    }
  }

  const showClickList = (listId) => {
    setShowList(true)
    setSelectedListId(listId)
  }

  useEffect(() => {

    if (selectedListId > 0) {
      fetch(`http://localhost:8080/api/todoItems/${selectedListId}`).then((response) => {
        return response.json()
      }).then(data => {
        console.log("to do list", data)
        setTodoItems(data)
      })
    }


  }, [selectedListId]);

  return (
    <>
      <div className="display-flex">
        <div className="div-size">
          <div>
            <button onClick={addNewList}>Add New List</button>
          </div>
          <div>
            {todoLists ? todoLists.map((todoList) => {
              return (
                <TodoList key={todoList.id} data={todoList} emitDeleteTodoList={handleDeleteTodoList} showTodoList={showClickList} />
              )
            }) : "loading data..."}
          </div>
        </div>
        {
          showList &&
          <div className="div-size">
            <div>
              <button onClick={addNewTodoItem}>Add New Task</button>
            </div>
            <div>
              {todoItems.length > 0 ? todoItems.map((todoItem) => {
                return (
                  <TodoItem key={todoItem.id} data={todoItem} emitDeleteTodoItem={handleDeleteTodoItem} listId={selectedListId} />
                )
              }) : "waiting to add tasks"}
            </div>
          </div>
        }


      </div>

    </>
  );
}

export default App;
