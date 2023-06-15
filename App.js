import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Cards from "./Components/Cards";

const initialCards = [
  "👹",
  "🙀",
  "👽",
  "🌻",
  "👻",
  "🐶",
  "🦄",
  "🧉",
  "🥐",
  "🌈",
  "⚡️",
];

const generateBoard = (currentLevel) => {
  const cardCount = 6 + (currentLevel - 1) * 2;
  const selectedCards = initialCards.slice(0, Math.ceil(cardCount / 2));
  const newBoard = shuffle([...selectedCards, ...selectedCards]);
  return newBoard;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(() => generateBoard(level));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [cardTurnedIndexes, setCardTurnedIndexes] = useState([]);
  const [reset, setReset] = useState(false);

  const calculateCardSize = (totalCards, maxTotalCards) => {
    const boardWidth = Dimensions.get("window").width;
    const boardHeight = Dimensions.get("window").height;
  
    const minDimension = Math.min(boardWidth, boardHeight);
    const maxCardSize = Dimensions.get("window").width / 3;
  
    const baseSize = maxCardSize ;
    const maxSize = baseSize + 10;
    const minSize = 55;
  
    const sizeDecrement = (baseSize - minSize) / (maxTotalCards - 1);
  
    const calculatedSize = baseSize - (totalCards - 1) * sizeDecrement;
  
    return Math.max(minSize, Math.min(calculatedSize, maxSize));
  };
  
  
  useEffect(() => {
    if (selectedCards.length !== 2) return;

    const [firstCardIndex, secondCardIndex] = selectedCards;

    if (board[firstCardIndex] === board[secondCardIndex]) {
      setMatchedIndexes([...matchedIndexes, firstCardIndex, secondCardIndex]);
      setSelectedCards([]);
      setScore(score + 1);

      if (didPlayerWin()) {
        goToNextLevel();
      }
    } else {
      const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (reset) {
      resetGame();
    }
  }, [reset]);

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setBoard(generateBoard(1));
    setSelectedCards([]);
    setMatchedIndexes([]);
    setCardTurnedIndexes([]);
    setReset(false);
  };

  const goToNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setScore(score + 1);
    setBoard(generateBoard(nextLevel));
    setSelectedCards([]);
    setMatchedIndexes([]);
    setCardTurnedIndexes([]);
  };

  const handleTapCard = (index) => {
    if (
      matchedIndexes.includes(index) ||
      selectedCards.includes(index) ||
      selectedCards.length >= 2
    ) {
      return;
    }

    const cardValue = board[index];

    if (selectedCards.length === 1) {
      const [firstCardIndex] = selectedCards;
      const firstCardValue = board[firstCardIndex];

      if (cardValue === firstCardValue) {
        setMatchedIndexes([...matchedIndexes, firstCardIndex, index]);
        setSelectedCards([]);
        setScore((prevScore) => prevScore + 1);
        if (board.length === matchedIndexes.length + 2) {
          goToNextLevel();
        }
      } else {
        setSelectedCards([...selectedCards, index]);
        setCardTurnedIndexes([...cardTurnedIndexes, index]);
      }
    } else {
      setSelectedCards([index]);
      setCardTurnedIndexes([...cardTurnedIndexes, index]);
    }
  };

  const didPlayerWin = () => matchedIndexes.length === board.length;

  const handleReset = () => {
    setReset(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {didPlayerWin() ? `¡Genial! 🎉` : `¡Comencemos!🤯 Nivel: ${level}`}
        </Text>
        <Text style={styles.title}>Puntuación: {score}</Text>
      </View>
      <View style={styles.board}>
        {board.map((card, index) => {
          const isTurnedOver =
            selectedCards.includes(index) || matchedIndexes.includes(index);
          const showQuestionMark = cardTurnedIndexes.includes(index);
          const cardSize = calculateCardSize(board.length, 16);
          return (
            <Cards
              key={index}
              onPress={() => handleTapCard(index)}
              isTurnedOver={isTurnedOver}
              cardSize={cardSize}
            >
              {isTurnedOver ? card : "?"}
            </Cards>
          );
        })}
      </View>
      <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>⟲</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#008b8b",
    marginVertical: 15,
  },
  resetButton: {
    backgroundColor: "#008b8b",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 24,
    color: "#fff",
  },
});
