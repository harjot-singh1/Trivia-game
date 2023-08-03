import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import AWS from 'aws-sdk';
import axios from 'axios';

// AWS.config.update({
//   accessKeyId: 'ASIAQHWNM2YMROFGHF4W',
//   secretAccessKey: 'eh2uH6uhJUz90hPges64/ULvZljnPtl9cL44qMZX',
//   sessionToken: 'FwoGZXIvYXdzEPf//////////wEaDK17XF3jAX+ZgyM2qyLAAfV1JHPWvoEFRucBtnnlODuuFmSWD2CWWucoZ3ijzKaLQ5oZBxgbGRZw5ayQDNbpYtQvI1OHKu4dTKMR+RBgWE+XGXPf/a9llqBMKfHFfIBYJTkpDwppBQd1KC0NahDgOm8NrhCxBj3/bhtgVUvqfY4MpY5hycCxeCb4ri+JOnGHv1SNSgQkjnle7FHkhuBpC2bIUP1/7l52iW6Qx9Kq72w2KzXkqth/X3lMzVPYJ1qMvji7BQLAruT+4C9xC1jMsSiG7ZCmBjIt5daCWQAgHDybLGEqIznCIx7fCCXyVjOs/WpZPa9RWnfoofkjDIDJ0JmTlohK',
//   region: 'us-east-1',
// });

const Ingame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextQuestionIndex, setNextQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [teamScores, setTeamScores] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(30);
  const { id, gameid } = useParams();
  const teamId = id;

  useEffect(() => {
    const fetchData = async () => {
      axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get?id=${gameid}`)
        .then((response) => {
          debugger
          const jsonData = response.data;
          console.log(jsonData);
          setQuestions(jsonData.questions);
        })
    };

    fetchData();
  }, []);

  useEffect(() => {
    let timer = null;

    if (timeRemaining > 0 && !showAnswer) {
      timer = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      handleNextQuestion();
    }

    return () => clearTimeout(timer);
  }, [timeRemaining, showAnswer]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const callLambdaFunction = async (team, score, lastQuestionAnswered) => {
    const url = 'https://zv23a2z684.execute-api.us-east-1.amazonaws.com/dev/insertscore';
    const payload = {
      instanceId: team,
      score: score,
      lastQuestionAnswered: lastQuestionAnswered
    };
    try {
      const response = await axios.post(url, payload);
      console.log('Lambda function invoked successfully:', response.data);
    } catch (error) {
      console.error('Error invoking Lambda function:', error);

    }
  }

  const callFetchLambda = async (team) => {
    const url = 'https://zv23a2z684.execute-api.us-east-1.amazonaws.com/dev/fetchscore';
    const payload = {
      instanceId: team,
    };
    try {
      const response = await axios.post(url, payload);
      console.log('Lambda function invoked successfully:', response.data);
      return response.data.body;
    } catch (error) {
      console.error('Error invoking Lambda function:', error);
    }
  };

  // const handleNextQuestion = async () => {
  //   const currentQuestion = questions[currentQuestionIndex];
  //   const team = teamId;
  //   const isAnswerCorrect = currentQuestion.answer === parseInt(selectedOption);

  //   const response = callFetchLambda(team);


  //   // Update team scores
  //   const updatedTeamScores = {
  //     ...teamScores,
  //     [team]: (teamScores[team] || 0) + (isAnswerCorrect ? 1 : 0),
  //   };
  //   setTeamScores(updatedTeamScores);

  //   // Show answer and explanation
  //   setShowAnswer(true);

  //   let realtimescore = 0;
  //   const lastQuestionAnswered = currentQuestionIndex + 1;
  //   Object.entries(teamScores).forEach(([team, score]) => realtimescore = score);


  //   setTimeout(() => {
  //     // Move to the next question

  //     // Call the Lambda function
  //     callLambdaFunction(team, realtimescore, lastQuestionAnswered);

  //     setCurrentQuestionIndex(nextQuestionIndex);
  //     setNextQuestionIndex(nextQuestionIndex + 1);
  //     setSelectedOption('');
  //     setTimeRemaining(30);
  //     setShowAnswer(false);
  //   }, 2000); // 2 seconds delay before moving to the next question
  // };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const team = teamId;
    const isAnswerCorrect = currentQuestion.answer === parseInt(selectedOption);
    let response = [];
      response = await callFetchLambda(team);
    

    const updatedTeamScores = {
      ...teamScores,
      [team]: (teamScores[team] || 0) + (isAnswerCorrect ? 1 : 0),
    };
    setTeamScores(updatedTeamScores);

    setShowAnswer(true);

    let realtimescore = 0;
    const lastQuestionAnswered = response.lastQuestionAnswered || currentQuestionIndex + 1;
    Object.entries(updatedTeamScores).forEach(([team, score]) => (realtimescore = score));

      callLambdaFunction(team, realtimescore, lastQuestionAnswered);
    

    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        // All questions answered, call the API to update game status
        const apiUrl = 'https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/updategamestatus';
        const payload = {
          instanceId: team,
          score: realtimescore,
          lastQuestionAnswered: lastQuestionAnswered,
        };
        axios.post(apiUrl, payload)
          .then((response) => {
            console.log('Data inserted successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error calling the API:', error);
          });
      }
      let nextQuestionIndexToShow = lastQuestionAnswered;
      setCurrentQuestionIndex(nextQuestionIndexToShow);
      setNextQuestionIndex(nextQuestionIndexToShow + 1);
      setSelectedOption('');
      setTimeRemaining(30);
      setShowAnswer(false);
    }, 2000);
  };


  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  // const insertData = async (team, score) => {
  //   // Store data in DynamoDB
  //   const dynamoDB = new AWS.DynamoDB.DocumentClient();
  //   const tableName = 'tblscore';

  //   const teamId = team;
  //   const teamScore = score;
  //   const timestamp = Date.now();
  //   console.log(teamId);
  //   console.log(score);
  //   const params = {
  //     TableName: tableName,
  //     Item: {
  //       teamId,
  //       score: teamScore,
  //       timestamp,
  //     },
  //   };
  //   try {
  //     await dynamoDB.put(params).promise();
  //   } catch (error) {
  //     console.error('Error storing data in DynamoDB:', error);
  //   }
  // };


  if (currentQuestionIndex >= questions.length) {
    return <div>All questions answered!
      {Object.entries(teamScores).map(([team, score]) => (
        <p key={team}>
          Team: {team},
          Score: {score}
        </p>
      ))}
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div>
        {/* Render current question */}
        <h3>Question {currentQuestionIndex + 1}</h3>
        <p>{currentQuestion.question}</p>

        {/* Render answer options */}
        {currentQuestion.options.map((option, index) => (
          <div key={option}>
            <input
              type="radio"
              id={option}
              name="option"
              value={index.toString()}
              checked={selectedOption === index.toString()}
              onChange={() => handleOptionSelect(index.toString())}
              disabled={showAnswer}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>

      {/* Render time remaining */}
      <p>Time Remaining: {timeRemaining} seconds</p>

      {/* Render submit button */}
      <button onClick={handleNextQuestion} disabled={!selectedOption}>
        Next Question
      </button>

      {/* Render team scores */}
      <div>
        <h3>Team Scores</h3>
        {Object.entries(teamScores).map(([team, score]) => (
          <p key={team}>
            {team}: {score}
          </p>
        ))}
      </div>

      {/* Render answer and explanation */}
      {showAnswer && (
        <div>
          <p>Correct Answer: {currentQuestion.options[currentQuestion.answer]}</p>
          <p>Explanation: {currentQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Ingame;
