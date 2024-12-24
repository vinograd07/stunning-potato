import React from "react";
import styles from "../styles/ViewPolls.module.css";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ViewPolls = () => {
  const { data, isLoading } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getAllPolls",
  });

  if (isLoading) {
    return <p>Загрузка опросов...</p>;
  }

  if (!data || data[0].length === 0) {
    return <p>Опросы не найдены.</p>;
  }

  const [questions, optionsList, votesList] = data;
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Список опросов</h2>
      {questions.map((question, index) => (
        <div key={index} className={styles.poll}>
          <h3 className={styles.pollTitle}>
            #{index} — {question}
          </h3>
          {optionsList[index].map((option, optIndex) => (
            <p key={optIndex} className={styles.option}>
              {option} — <span className={styles.voteCount}>{Number(votesList[index][optIndex])}</span> голосов
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewPolls;
