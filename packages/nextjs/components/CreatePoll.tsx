import React, { useState } from "react";
import styles from "../styles/CreatePoll.module.css";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (index: any, value: any) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async () => {
    if (!question || options.some(option => !option)) {
      alert("Заполните все поля!");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "createPoll",
        args: [question, options],
      });
      alert("Опрос успешно создан!");
    } catch (error) {
      console.error("Ошибка создания опроса:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Создать опрос</h2>
      <input
        type="text"
        placeholder="Вопрос"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className={styles.input}
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Опция ${index + 1}`}
          value={option}
          onChange={e => updateOption(index, e.target.value)}
          className={styles.input}
        />
      ))}
      <button onClick={addOption} className={styles.button}>
        Добавить опцию
      </button>
      <button onClick={createPoll} className={styles.button}>
        Создать опрос
      </button>
    </div>
  );
};

export default CreatePoll;
