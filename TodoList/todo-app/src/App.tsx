import {
  Container,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import TodoList from "./components/todoList";
import axios from "axios";
import React from "react";
import "./App.css";

function App() {
  const [todoTitle, setTitle] = React.useState<String>('')

  function addData() {
    axios.post("http://localhost:6969/notes/post", {
      title: todoTitle,
    }).then(() => {
      setTitle('');
      window.location.reload();
    });
  }
  return (
    <>
      <Container maxWidth="sm">
        <Stack sx={{ my: 1 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            To-do list
          </Typography>
          <TextField
            id="filled-basic"
            label="What do you want to do?"
            onChange={(e) => setTitle(e.target.value)}
            variant="filled"
          />
          <Button variant="contained" onClick={addData}>Add</Button>
        </Stack>
        <TodoList />
      </Container>
    </>
  );
}
export default App;
