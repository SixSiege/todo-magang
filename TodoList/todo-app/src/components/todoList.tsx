import React from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default class TodoList extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      todos: [],
      newTodo: ''
    };
  }

  getData() {
    axios.get("http://localhost:6969/notes").then((res) => {
      this.setState({ todos: res.data });
    });
  }

  deleteData(id: Number) {
    axios.delete(`http://localhost:6969/notes/${id}`)
    .then((res) => {
      console.log("Deleted data:" + res.data);
      window.location.reload();
    });
  }

  handleCheckboxChange = (id: Number) => {
    const updatedTodos = this.state.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isChecked: !todo.isChecked };
      }
      return todo;
    });

    this.setState({ todos: updatedTodos }, () => {
      axios.put(`http://localhost:6969/notes/finish/${id}`)
        .then(response => {
          console.log('Checkbox updated:', response.data);
        })
        .catch(error => {
          console.error('Error updating checkbox state:', error);
        });
    });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Stack sx={{ pt: 4 }}>
        <Card sx={{ minWidth: 275, minHeight: 45 }}>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {this.state.todos.map((value: any) => {
              const labelId = `checkbox-list-label-${value.id}`;

              return (
                <ListItem
                  key={value.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => this.deleteData(value.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        tabIndex={-1}
                        checked={value.isChecked}
                        onChange={() => this.handleCheckboxChange(value.id)}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={`${value.title}`}
                      style={{
                        textDecoration: value.isChecked
                          ? "line-through"
                          : "none",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Card>
      </Stack>
    );
  }
}
