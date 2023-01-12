import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { GROUPS_COLLECTION, PLAYERS_COLLECTION } from './config/storage';

async function create(name: string) {
  try {
    const storedGroups = await getAll();

    const groupAlreadyExists = storedGroups.includes(name.trim());

    if (groupAlreadyExists) {
      throw new AppError('Já existe um projeto cadastrado com esse nome.');
    }

    const storage = JSON.stringify([...storedGroups, name.trim()]);

    await AsyncStorage.setItem(GROUPS_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

async function getAll() {
  try {
    const storage = await AsyncStorage.getItem(GROUPS_COLLECTION);

    const groups: string[] = storage ? JSON.parse(storage) : []

    return groups;
  } catch (error) {
    throw error;
  }
}

async function removeByName(name: string) {
  try {
    const storedGroups = await getAll();
    const groups = storedGroups.filter(group => group !== name);

    await AsyncStorage.setItem(GROUPS_COLLECTION, JSON.stringify(groups));

    await AsyncStorage.removeItem(`${PLAYERS_COLLECTION}-${name}`)

    return groups;
  } catch (error) {
    throw error;
  }
}

export { create, getAll, removeByName }