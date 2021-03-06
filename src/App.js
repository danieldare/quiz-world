import React, { useState, useEffect } from 'react';
import QuestionsService from "./questions";
import Questions from './Questions/Questions';
import './App.scss';
import QuestionCount from './QuestionCount/QuestionCount';
import Answers from './Answers/Answers';
import LastPage from './LastPage/LastPage';

function App() {
  const [ state, setState ] = useState({
      correctCount: 0,
      count: 0,
      activeQuestion: "",
      activeOptions: [],
      userAnswer: "",
      checked: false,
      completed: false,
      correctAnswer: "",
      questionIndex: 0,
      isLoading: false,
      isShaking: false,
      passMark: 50
  });

  useEffect(() => {
    setState((curState) => ({
      ...curState,
      activeQuestion: QuestionsService[0].question,
      activeOptions: QuestionsService[0].options,
    }))
  }, []);

  const resetGame = () => {
    setState((curState) => ({
      ...curState,
      activeQuestion: QuestionsService[0].question,
      activeOptions: QuestionsService[0].options,
      correctCount: 0,
      count: 0,
      userAnswer: "",
      checked: false,
      completed: false,
      correctAnswer: "",
      isLoading: false,
      isShaking: false,
      passMark: 50
    }))
  }

  const nextQuestion = () => {
    const curQuestion = QuestionsService.findIndex(q => q.question === state.activeQuestion);
    if(state.checked){
      if(curQuestion + 1  !== QuestionsService.length ){
        setState((curState) => ({
          ...curState,
          activeQuestion: QuestionsService[curQuestion + 1].question,
          activeOptions: QuestionsService[curQuestion + 1].options,
          correctAnswer: QuestionsService[curQuestion].answer,
          count: curState.count + 1,
          checked: false,
          isShaking: false,
          correctCount: curState.userAnswer === curState.correctAnswer ? curState.correctCount + 1 : curState.correctCount,
        }))
      }
      
      if(curQuestion === QuestionsService.length - 1)
        setState((curState) => ({
          ...curState,
          count: curState.count + 1,
          correctCount: curState.userAnswer === curState.correctAnswer ? curState.correctCount + 1 : curState.correctCount,
          completed: true,
          correctAnswer: QuestionsService[curQuestion].answer,
        }))
      
    }else{
        setState((curState) => ({
          ...curState,
          isShaking: !curState.checked
        }))
    }
  }

  const getUserAnswer = (value, checkBool ) => {
    const curQuestion = QuestionsService.findIndex(q => q.question === state.activeQuestion);
    setState((curState) => ({
      ...curState,
      userAnswer: value,
      correctAnswer: QuestionsService[curQuestion].answer,
      checked: checkBool, 
      isShaking: false,
      questionIndex: curQuestion + 1
    })); 
  }
   
  console.log(state)

  return (
    <div className="Quiz-container">
      <h3 className="title">Quiz world</h3>
      {state.isShaking && <p className="alert">Kindly select an answer</p>}
    <div className={`Quiz ${state.isShaking && " shake"}` }>
      {state.completed ?  
        <LastPage 
          questionLength={QuestionsService.length} 
          correctCount={state.correctCount} 
          pastMark={state.passMark}
          resetGame={resetGame}
          /> 
          : 
          (
        <>
          <QuestionCount counter={state.count + 1} total={QuestionsService.length} />
          {state.isLoading ? "loading..." : 
          <>
            <Questions question={state.activeQuestion} />
              {state.activeOptions.map(ans => 
                <ul key={ans}>
                  <Answers
                    options={ans} 
                    getUserAnswer={getUserAnswer}
                    />
                </ul>
              )}
          </>
          }
            <div className="btn-container">
              <div className="btn-next" onClick={nextQuestion}>Next</div>
            </div>
        </>
      )}
          
    </div>
    </div>
  );
}

export default App;
