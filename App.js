import { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert, FlatList, Text, Image } from 'react-native';

export default function App() {
  const [keyword, setKeyword] = useState(''); //tilamuuttuja
  const [recipes, setRecipes] = useState([]); //tilamuuttuja jossa asetetaan tyhjä taulukko

  const getRecipes = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${keyword}`);
      const data = await response.json(); // muuntaa vastauksen JSON- muotoon, await: odottaa vastauksen saapumista ennen seuraavaan riviin siirtymistä
      console.log(data.meals);
      if (data.meals) { // tarkastaa onko mieals-objekti olemassa ja sisältääkö se reseptejä
        setRecipes(data.meals);//hakee taulukkoon reseptit
      } else {
        Alert.alert('No results found');
        setRecipes([]);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleFetch = () => { // erottaa painikkeen painamisen ja getrecipes toisistaan. Tätä voi muokata tai
    //laajentaa myöhemmin ilman että muita osia tarvitsee muokata
    getRecipes();
  };

  return ( //määrittelee tekstikentän ja painikkeen
    <View style={styles.container}>
      <TextInput 
        style={{fontSize: 18, width: 200, marginTop: 30}} 
        placeholder='keyword' 
        value={keyword}
        onChangeText={text => setKeyword(text)} 
      />
      <Button title="Find" onPress={handleFetch} style={styles.button} /> 

      <FlatList //listaa recipes tilamuuttujasta reseptit ja äyttää ne erillisenä elementtinä.
      //Tämä tapahtuu renderItem-propin avulla, jossa määritellään, kuinka jokainen yksittäinen elementti näyttäytyy.
        data={recipes} 
        keyExtractor={(item) => item.idMeal}//idMeal on jokaisen reseptin oma tunnus
        renderItem={({item}) => ( //jokaiselle reseptille luodaan oma item-objekti
          <View>
            
            <Text style={{fontSize: 18, fontWeight: "bold"}}>
              {item.strMeal} {/*palauttaa reseptin nimen*/}
            </Text>
            <Text style={{fontSize: 16 }}>
              {item.strInstructions}
            </Text>
            <Image source= {{uri: item.strMealThumb}} style={styles.image}/>
            {/*Thumb tarkoittaa kuvaa, uri on URL-osoite kuvasta */}      
            <View style={styles.divider}/>    
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image:{
    height: 100,
    width: 100,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10

  },
  divider: {
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 10,
    width: '100%',
  },


});