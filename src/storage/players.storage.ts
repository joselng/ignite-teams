import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { PLAYERS_COLLECTION } from './config/storage';

import { PlayerStorageDTO } from "./dtos/PlayerStorageDTO";

async function addByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storedPlayers = await getByGroup(group);

    const playerAlreadyExists = storedPlayers.some(player => player.name === newPlayer.name)

    if (playerAlreadyExists) {
      throw new AppError('Essa pessoa já está adicionada em um time.');
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer]);

    await AsyncStorage.setItem(`${PLAYERS_COLLECTION}-${group}`, storage);

  } catch (error) {
    throw error;
  }
}

async function getByGroup(group: string) {
  try {
    const storage = await AsyncStorage.getItem(`${PLAYERS_COLLECTION}-${group}`);

    const players: PlayerStorageDTO[] = storage ? JSON.parse(storage) : []

    return players;
  } catch (error) {
    throw error;
  }
}

async function removeByGroup(playerName: string, group: string) {
  try {
    const storage = await getByGroup(group);

    const filtered = storage.filter(player => player.name !== playerName);

    const players = JSON.stringify(filtered);

    await AsyncStorage.setItem(`${PLAYERS_COLLECTION}-${group}`, players);

    return players;
  } catch (error) {
    throw error;
  }
}

async function getByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await getByGroup(group);

    const players = storage.filter(player => player.team === team)

    return players;
  } catch (error) {
    throw error;
  }
}

export { addByGroup, getByGroup, getByGroupAndTeam, removeByGroup }