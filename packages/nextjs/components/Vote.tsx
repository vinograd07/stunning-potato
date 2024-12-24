import React, { useState } from "react";
import styles from "../styles/CreatePoll.module.css";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Vote = () => {
  const [pollId, setPollId] = useState(0);
  const [optionIndex, setOptionIndex] = useState(0);

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const castVote = async () => {
    try {
      await writeContractAsync({
        functionName: "vote",
        args: [BigInt(pollId), BigInt(optionIndex - 1)],
      });
      alert("Голос успешно отправлен!");
    } catch (error) {
      console.error("Ошибка голосования:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Голосование</h2>
      <input
        type="number"
        placeholder="ID опроса"
        value={pollId}
        onChange={e => setPollId(Number(e.target.value))}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Индекс опции"
        value={optionIndex}
        onChange={e => setOptionIndex(Number(e.target.value))}
        className={styles.input}
      />
      <button onClick={castVote} className={styles.button}>
        Проголосовать
      </button>
    </div>
  );
};

export default Vote;
