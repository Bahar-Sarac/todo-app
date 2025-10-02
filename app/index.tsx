import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import React from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const todoData = [
    { id: 1, title: "8 bardak su iç", completed: true },
    { id: 2, title: "yürüyüşe çık", completed: true },
    { id: 3, title: "ders çalış", completed: false },
    { id: 4, title: "nefes egzersizi yap", completed: false },
    { id: 5, title: "şekersiz beslen", completed: false },
  ];

  return (

  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="menu" size={24} color="black" /> 
      </TouchableOpacity>
    </View>
    <View style={styles.searchBar}>
      <Ionicons name="search" size={24} color="black" />
      <TextInput placeholder='Search'/>
    </View>
    
    <FlatList
      data={todoData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.todoContainer}>
          <View style={styles.todoInfoContainer}>
          <Checkbox value={item.completed} color={item.completed ? "#7d4df6ff" : undefined}></Checkbox>
          <Text style={[styles.todoText, item.completed && {textDecorationLine: "line-through"}]}>{item.title}</Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
          <Ionicons name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    />


    <KeyboardAvoidingView style={styles.footer}>
      <TextInput placeholder='New To Do' style={styles.newTodoInput}/>
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:20,
  },
  searchBar:{
    flexDirection:"row",
    backgroundColor:"#ffffffe0",
    padding: 5,
    borderRadius:15,
    gap:10,
    marginBottom:20,
  },
  todoContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor:"#ffffffe0",
    padding:10,
    borderRadius: 15,
    gap:10,
    marginBottom:10,
  },
  todoInfoContainer:{
    flexDirection:"row",
    gap:10,
    alignItems:"center", //ne için bak
  },
  todoText:{
    fontSize:16,
    color:"#000",
  },
  footer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  newTodoInput:{
    flex:1,
    backgroundColor:"#ffffffe0",
    padding:10,
    borderRadius:15,
    fontSize:16,
    color:"#000",
  },
  addButton:{
    backgroundColor:"#7d4df6ff",
    padding:10,
    borderRadius:15,
    marginLeft:10,
  }

});