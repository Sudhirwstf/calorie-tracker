import React, { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [email, setEmail] = useState("user@example.com");
  const [username, setUsername] = useState("JohnDoe");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState({ email: false, username: false });
  const [totalCalories, setTotalCalories] = useState(0);
  useFocusEffect(
    useCallback(() => {
      const fetchTotalCalories = async () => {
        try {
          const storedCalories = await AsyncStorage.getItem("totalCalories");
          setTotalCalories(storedCalories ? parseInt(storedCalories, 10) : 0);
        } catch (error) {
          console.error("Error fetching total calories:", error);
          setTotalCalories(0);
        }
      };

      fetchTotalCalories();
    }, [])
  );

  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profilePic ? { uri: profilePic } : require("@/assets/images/person-purple-fill.png")}
          style={styles.profilePic}
        />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        {isEditing.username ? (
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            onBlur={() => setIsEditing({ ...isEditing, username: false })}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing({ ...isEditing, username: true })}>
            <Text style={styles.text}>{username}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        {isEditing.email ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onBlur={() => setIsEditing({ ...isEditing, email: false })}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing({ ...isEditing, email: true })}>
            <Text style={styles.text}>{email}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Calories</Text>
        <Text style={styles.text}>{totalCalories}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  text: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
});
