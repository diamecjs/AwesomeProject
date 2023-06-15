import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Card({ onPress, isTurnedOver, children, cardSize }) {
  const cardStyle = {
    width: cardSize,
    height: cardSize,
    margin: 10,
    borderRadius: 0.25 * cardSize,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
  };

  return (
    <Pressable style={[isTurnedOver ? styles.cardUp : styles.cardDown, cardStyle]} onPress={onPress}>
      {isTurnedOver ? <Text style={styles.text}>{children}</Text> : <Text style={styles.text}>?</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardUp: {
    borderColor: "#00008b",
  },
  cardDown: {
    borderWidth: 10,
    borderColor: "#daa520",
  },
  text: {
    fontSize: 32,
    color: "#ff8c00",
  },
});
