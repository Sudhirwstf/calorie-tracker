import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const calorieItems: Record<string, number> = {
  // Western Snacks
  Chips: 150,
  "Chocolate Bar": 250,
  Cookies: 200,
  Pizza: 285,
  Burger: 300,
  Pasta: 400,
  Soda: 150,
  "Orange Juice": 120,
  Coffee: 5,

  // Indian Snacks
  Samosa: 260,
  Kachori: 300,
  Pakora: 250,
  "Aloo Tikki": 275,
  "Paneer Tikka": 220,
  "Vada Pav": 300,
  Dhokla: 150,
  "Pani Puri": 180,
  "Bhel Puri": 150,
  Jalebi: 400,
  GulabJamun: 140,
  Rasgulla: 120,
  "Besan Ladoo": 180,
  "Mysore Pak": 210,
  "Kaju Katli": 200,
  "Chana Chaat": 150,
  "Masala Dosa": 350,
  Idli: 100,
  "Medu Vada": 175,
  "Pav Bhaji": 400,
  "Chicken Biryani": 500,
  "Vegetable Biryani": 400,
  Paratha: 300,
  "Matar Paneer": 250,
  "Rajma Chawal": 350,
  "Dal Makhani": 320,
  "Chole Bhature": 450,
  "Baati Chokha": 350,
  "Misal Pav": 400,
  Poha: 250,
  Upma: 200,
  "Sev Puri": 180,
  "Egg Curry": 250,
  "Fish Curry": 300,
  "Butter Chicken": 450,
  "Mutton Curry": 500,
  "Keema Pav": 350,
};

export default function CalorieScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
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
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = Object.keys(calorieItems).filter((item) => item.toLowerCase().includes(query.toLowerCase()));
      setFilteredItems(filtered);
      setIsDropdownVisible(true);
    } else {
      setFilteredItems([]);
      setIsDropdownVisible(false);
    }
  };

  const handleItemSelect = async (itemName: string) => {
    try {
      const calories = totalCalories + calorieItems[itemName];
      await AsyncStorage.setItem("totalCalories", String(calories));
      setTotalCalories(calories);
    } catch (e) {
      alert("failed to store calories");
    }
    setSearchQuery("");
    setFilteredItems([]);
    setIsDropdownVisible(false);
  };

  const handleOutsideClick = () => {
    setIsDropdownVisible(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.container}>
        <Text style={styles.title}>Calorie Tracker</Text>
        <Text style={styles.totalCalories}>Total Calories: {totalCalories}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search for food or drinks..."
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setIsDropdownVisible(true)}
        />

        {isDropdownVisible && filteredItems.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleItemSelect(item)}>
                  <Text style={styles.itemName}>{item}</Text>
                  <Text style={styles.itemCalories}>{calorieItems[item]} kcal</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dropdown: {
    maxHeight: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
  },
  itemCalories: {
    fontSize: 14,
    color: "#666",
  },
});
