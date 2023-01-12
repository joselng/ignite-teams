import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";

import { create } from "@storage/groups.storage";
import { AppError } from "@utils/AppError";

import { Container, Content, Icon } from "./styles";

export function NewGroup() {
  const [group, setGroup] = useState('');

  const navigation = useNavigation();

  async function handleNewGroup() {
    try {
      if (group.trim().length === 0) {
        setGroup("");
        return Alert.alert("Novo Grupo", "Informe o nome do grupo.")
      }

      await create(group);
      navigation.navigate('players', { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message);
        return;
      }
      console.log(error)
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight 
          title="Novo Grupo"
          subtitle="crie o grupo e adicione novos jogadores"
        />

        <Input placeholder="Nome do grupo" onChangeText={setGroup} value={group} />

        <Button title="Criar" style={{ marginTop: 20 }} onPress={handleNewGroup} />
      </Content>
    </Container>
  )
}