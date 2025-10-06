import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "expo-checkbox";
import { useEffect, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
};

export default function Index() { //Uygulama açıldığında gösterilecek ekran.
  const todoData = [ //Sadece test amaçlı, örnek todo listesi.
    {id: 1, title: "Todo 1", isDone: false},
    {id: 2, title: "Todo 2", isDone: true},
    {id: 3, title: "Todo 3", isDone: false},  
    {id: 4, title: "Todo 4", isDone: true},
    {id: 5, title: "Todo 5", isDone: false},
  ];

  //State Tanımları:
  //useState: Bileşenin içinde değişebilen (dinamik) verileri tutar.
  const [todos, setTodos] = useState<ToDoType[]>([]); //Uygulamadaki aktif görevleri tutar.
  const [todoText, setTodoText] = useState<string>(""); //Kullanıcının girdiği yeni todo metnini tutar.
  const [searchQuery, setSearchQuery] = useState<string>(""); //Arama çubuğundaki metni saklar.
  const [oldTodos, setOldTodos] = useState<ToDoType[]>([]); //Filtreleme (arama) yaparken orijinal veriyi korumak için tutulur.

  //useEffect: Uygulama açıldığında veya belirli durumlar değiştiğinde bir fonksiyon çalıştırır (örn. veriyi yüklemek). Amaç: Uygulama açıldığında AsyncStorage’dan kayıtlı veriyi çekmek.
  useEffect(() => { //Sadece ilk render'da çalışır.
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("my-todo");
        if (todos !== null) {
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));
          //JSON.parse: Saklanan metni (string) diziye çevirir.
          // setTodos ve setOldTodos: Listeyi ekrana yansıtır.
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTodos();
  }, []);

  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(), //Benzersiz ID oluşturur.
        title: todoText,
        isDone: false,
      };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      setOldTodos(todos);
      await AsyncStorage.setItem("my-todo", JSON.stringify(todos)); //Güncel listeyi kaydeder.
      setTodoText("");
      Keyboard.dismiss(); //Klavyeyi kapatır.
    } catch (error) {
      console.log(error);
    }
  };

  //ID’si eşleşmeyen todo’ları filtreleyip yenisini kaydeder:
  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  };

  //Todo tamamlandı olarak işaretlemek:
  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  };

  //Arama fonksiyonu:
  const onSearch = (query: string) => {
    if (query == "") {
      setTodos(oldTodos);
    } else {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(query.toLowerCase())
      );
      setTodos(filteredTodos);
    }
  };

  //Kullanıcı arama kutusuna her yazdığında filtreleme çalışır:
  useEffect(() => 
    {onSearch(searchQuery);},
    [searchQuery]);

  return (
    //SafeAreaView: Ekranın güvenli alanını kullanarak içeriğin kesilmesini önler.
    <SafeAreaView style={styles.container}>
      {/* Header: Üst kısım, menü butonu vs. */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="menu" size={24} color={"#333"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}></TouchableOpacity>
      </View>

      {/* Arama Çubuğu */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={"#333"} />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
          clearButtonMode="always"
        />
      </View>

      {/* FlatList: Uzun liste verilerini performanslı bir şekilde göstermek için kullanılır. */}
      <FlatList
        data={[...todos].reverse()} //Son eklenen en üstte görünür.
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ToDoItem
            todo={item}
            deleteTodo={deleteTodo}
            handleDone={handleDone}
          />
        )}
      />
      
      {/*KeyboardAvoidingView: Klavye açıldığında bileşenleri yukarı kaydırır (Input gizlenmesin diye).*/}
      <KeyboardAvoidingView 
        style={styles.footer}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <TextInput
          placeholder="Add New ToDo"
          value={todoText}
          onChangeText={(text) => setTodoText(text)}
          style={styles.newTodoInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addTodo()}>
          <Ionicons name="add" size={34} color={"#fff"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//ToDoItem: Her bir todo öğesini temsil eden alt bileşen.
const ToDoItem = ({
  todo,
  deleteTodo,
  handleDone,
}: {
  todo: ToDoType;
  deleteTodo: (id: number) => void;
  handleDone: (id: number) => void;
}) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox
        value={todo.isDone}
        onValueChange={() => handleDone(todo.id)}
        color={todo.isDone ? "#4630EB" : undefined}
      />
      <Text
        style={[
          styles.todoText,
          todo.isDone && { textDecorationLine: "line-through" },
        ]}
      >
        {todo.title}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => {
        deleteTodo(todo.id);
        alert("Deleted " + todo.id);
      }}
    >
      <Ionicons name="trash" size={24} color={"red"} />
    </TouchableOpacity>
  </View>
);

{/*StyleSheet: Stil tanımlamalarını yapar ve performans optimizasyonu sağlar*/}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 8,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  todoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  todoInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    bottom: 20,
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4630EB",
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
  },
});