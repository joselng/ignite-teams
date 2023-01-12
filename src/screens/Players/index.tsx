import { useEffect, useState, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { addByGroup, getByGroup, getByGroupAndTeam, removeByGroup } from "@storage/players.storage";
import { PlayerStorageDTO } from "@storage/dtos/PlayerStorageDTO";

import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { Loading } from '@components/Loading';
import { ListEmpty } from "@components/ListEmpty";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { removeByName } from "@storage/groups.storage";

type RouteParams = {
  group: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('time a');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const navigate = useNavigation();

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      Alert.alert('Novo Player', 'Informe o nome da pessoa para adicionar.');
      return;
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await addByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('');
      fecthPlayersByTeam();

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message);
        return;
      }
      console.log(error)
    }
  }

  async function fecthPlayersByTeam() {
    try {
      const playersByTeam = await getByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await removeByGroup(playerName, group);
      fecthPlayersByTeam();
    } catch (error) {
      Alert.alert('Pessoas', 'Não foi possível remover o player selecionado.')
    }
  }

  async function handleGroupRemove() {
    try {
      Alert.alert('Remover Grupo', `Tem certeza que deseja remover o Grupo ${group}?`, [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: async () => {
          await removeByName(group);
          navigate.navigate('groups');
        }},
      ])
    } catch (error) {
      Alert.alert('Remover Grupo', 'Não foi possível remover o grupo.')
    }
  }

  useEffect(() => {
    fecthPlayersByTeam();
  }, [team])

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input 
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList 
          data={['time a', 'time b']}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Filter 
              title={item} 
              isActive={item === team} 
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />  

        <NumbersOfPlayers>{players.length}</NumbersOfPlayers>    
      </HeaderList>

      {
        isLoading ? <Loading /> : 
        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard 
              name={item.name} 
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas nesse time" />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
        />
      }

      <Button title="Remover Turma" type="SECONDARY" onPress={handleGroupRemove} />
    </Container>
  )
}