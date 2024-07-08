import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  //form
  const [todoTask, setTodoTask] = useState("");
  const [todoId, setTodoId] = useState("");

  function addEditTask(e) {
    e.preventDefault();
    if (todoTask) {
      if (!todoId) {
        //add todo
        let body = {
          task: todoTask,
        };
        setChanges(body, "POST");
      } else {
        //edit todo
        let body = {
          id: todoId,
          task: todoTask,
        };
        setChanges(body, "POST");
      }
    }
  }

  function editTodo(id) {
    //load todo in the input
    setTodoId(id);
    let selectedTodo = todos.filter((todo) => todo.ID == id);
    setTodoTask(selectedTodo[0].Task);
  }

  function deleteTodo(deletedId) {
    const body = {
      id: deletedId,
    };
    setChanges(body, "DELETE");
  }

  function changeTodoDone(todoId) {
    let selectedTodo = todos.filter((todo) => todo.ID == todoId);

    const body = {
      task: selectedTodo[0].Task,
      id: selectedTodo[0].ID,
      done: selectedTodo[0].Done == 0 ? 1 : 0,
    };

    setChanges(body, "POST");
  }

  function setChanges(body, method) {
    fetch("http://www.localhost:8000/todoserver.php", {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res == true) {
          setTodoTask("");
          setTodoId("");
          getTodos();
        }
      })
      .catch((error) => console.log(error));
  }

  function getTodos() {
    fetch("http://www.localhost:8000/todoserver.php", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  }

  useEffect(() => {
    if (!todos.length && !todoTask) {
      fetch("http://www.localhost:8000/todoserver.php", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.length > 0) {
            //set todos only if array is not empty
            setTodos(res);
          }
        });
    }
  });

  return (
    <div className="App">
      <form className="mt-2 mb-5">
        <span className="me-1">Task:</span>
        <input
          value={todoTask}
          type="text"
          onChange={(e) => setTodoTask(e.target.value)}
        />
        <button className="btn btn-primary m-3" onClick={(e) => addEditTask(e)}>
          Submit{" "}
        </button>
      </form>
      {todos.length > 0 && (
        <div className="d-flex justify-content-center">
          <table className="table table-bordered w-50">
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.ID}>
                  <td>{todo.Task}</td>
                  <td>{todo.Done == 1 ? "Done" : "Not Done"}</td>
                  <td>
                    <button
                      className="btn btn-primary me-3"
                      onClick={() => changeTodoDone(todo.ID)}
                    >
                      Done
                    </button>
                    <button
                      className="btn btn-primary me-3"
                      onClick={() => editTodo(todo.ID)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => deleteTodo(todo.ID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
