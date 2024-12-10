import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecipeScreen = () => {

  const navigation = useNavigation();

  const [recipes, setRecipes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRecipesData();
  }, []);

  const setRecipesData = async () => {
    let recipeData = await fetch('https://dummyjson.com/recipes?limit=0')
    .then(res => res.json())
    .then(resData => {
        return resData
    });
    setRecipes(recipeData.recipes);
  }

  const handleEndEditing = () => {
    if (searchTerm.trim()) {
      searchRecipe(searchTerm);
    }
  };

  const searchRecipe = async (name) => {
    let searchResult = await fetch(`https://dummyjson.com/recipes/search?q=${name}`)
    .then(res => res.json())
    .then(resData => {
        return resData
    });
    setRecipes(searchResult.recipes);

  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipe List</Text>
      <TextInput
        style={styles.searchBox}
        placeholderTextColor={'grey'}
        placeholder="Search recipes..."
        value={searchTerm}
        onChangeText={(text) => {
            setSearchTerm(text);
            handleEndEditing();
        }}
      />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.recipeImage}
              resizeMode="cover"
            />
            <Text style={styles.recipeName}>{item.name}</Text>
          </View>
        )}
        // onEndReached={loadMoreRecipes}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
},
header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
},
searchBox: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
},
recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
},
recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
},
recipeName: {
    fontSize: 16,
    flex: 1,
},
});

export default RecipeScreen;
