import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEME } from "./src/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  statusMessage: {
    margin: 7,
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: THEME.card,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: THEME.card,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: THEME.addButton,
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 20,
    backgroundColor: THEME.card,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 26,
    width: 26,
    backgroundColor: THEME.card,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.delete,
    marginLeft: 10,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.headerBg,
  },
  clearContainer: {
    height: 30,
    width: 60,
    backgroundColor: THEME.white,
    elevation: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState("");

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please input task");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
    }
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodosItem = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = (todoId) => {
    const newTodosItem = todos.filter((item) => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert("", "Do you want to clear all tasks?", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "No",
      },
    ]);
  };

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: THEME.primary,
              textDecorationLine: todo?.completed ? "line-through" : "none",
            }}
          >
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View
              style={[styles.actionIcon, { backgroundColor: THEME.complete }]}
            >
              <Icon name="done" size={20} color={THEME.white} />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="close" size={20} color={THEME.white} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "THEME.white",
        }}
      >
        <View style={styles.header}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: THEME.white,
            }}
          >
            TASX
          </Text>
          <TouchableOpacity onPress={clearAllTodos}>
            <View style={styles.clearContainer}>
              <Icon name="delete" size={25} color={THEME.delete} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.statusMessage}>
          <Text>Your tasks for today:</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          data={todos}
          renderItem={({ item }) => <ListItem todo={item} />}
        />

        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              value={textInput}
              placeholder="Add new task..."
              onChangeText={(text) => setTextInput(text)}
            />
          </View>
          <TouchableOpacity onPress={addTodo}>
            <View style={styles.iconContainer}>
              <Icon name="add" color={THEME.white} size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default App;
