import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AWS from 'aws-sdk';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

AWS.config.update({
  accessKeyId: 'ASIAQHWNM2YMVTBGRMM3',
  secretAccessKey: 'ZJBnU0CRI9WExe/xy+lFoAbGR3QeAVGKwkZ0WIlg',
  sessionToken: 'FwoGZXIvYXdzEIf//////////wEaDCG1SAPvUpAAoVIdZCLAAaecwClW5KJYtu0BKEHbbdlu42zWM9LYC1szi1yM/AiNX1mdmDwYlm2sOpzdgTlCZPRZ5GZEiUjoVstae62U9ptTO9jls6NbTFbxgLzpqtt9wMsyCKg3zw6DkTFZdez8ryGXzsSgG6u5s30+BbV8G41C9x22hI+ym6ev+z3XpwghMO97wMhV1OLMN2PsaL5pGPMFCJSqfIFfswRKaQPFJQj3Hp4sSefaVMwXnI2pJLbMzZ/XYOJ3TsoNwZIT7krMBijur7CmBjIt3j+9mr/JCaFAzbpB6n7nxPRhmCCDcetql7W2W3OoQwDpJ5zbHlOaignKRBGP',
  region: 'us-east-1',
});

const Ingame = () => {
  const lastQuestionAnsweredRef = useRef(0); // Create a mutable reference
  const currentQuestionIndexRef = useRef(0); // Create a mutable reference
  const [questions, setQuestions] = useState([]);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextQuestionIndex, setNextQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [teamScores, setTeamScores] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(30);
  const { id, gameid } = useParams();
  const teamId = id;
  const navigate = useNavigate();
  // const [lastQuestionAnswered, setLastQuestionAnswered] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get?id=${gameid}`)
        .then((response) => {
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
      lastQuestionAnswered: currentQuestionIndexRef.current + 1
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
      // console.log('Lambda function invoked successfully:', response.data);
      return response.data.body;
    } catch (error) {
      console.error('Error invoking Lambda function:', error);
    }
  };

  const pollData = async () => {
    console.log("polling:" + Date.now());
    const response = await callFetchLambda(teamId);
    // console.log(response);
    if (response) {
      const jsonRes = JSON.parse(response);
      console.log(jsonRes.lastQuestionAnswered + "+++++++++++++ " + currentQuestionIndexRef.current + 1);
      if (jsonRes && jsonRes.lastQuestionAnswered !== undefined && jsonRes.lastQuestionAnswered === currentQuestionIndexRef.current + 1) {
        lastQuestionAnsweredRef.current = (jsonRes.lastQuestionAnswered);
        handleNextQuestion();
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      (async () => {
        await pollData();
      })();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

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
    console.log("next question triggered: Current index: " + currentQuestionIndexRef.current);
    const currentQuestion = questions[currentQuestionIndexRef.current];
    const team = teamId;
    if (selectedOption !== '') {
      const isAnswerCorrect = currentQuestion.answer === parseInt(selectedOption);
      const updatedTeamScores = {
        ...teamScores,
        [team]: (teamScores[team] || 0) + (isAnswerCorrect ? 1 : 0),
      };
      setTeamScores(updatedTeamScores);
      setShowAnswer(true);
      let realtimescore = 0;
      const lastQuestionAnswered = currentQuestionIndexRef.current + 1;
      Object.entries(updatedTeamScores).forEach(([team, score]) => (realtimescore = score));
      callLambdaFunction(team, realtimescore, lastQuestionAnswered);
      // setTimeout(() => {
      //   if (currentQuestionIndexRef.current === questions.length - 1) {
      //     // All questions answered, call the API to update game status
      //     const apiUrl = 'https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/updategamestatus';
      //     const payload = {
      //       instanceId: team,
      //       score: realtimescore,
      //       lastQuestionAnswered: lastQuestionAnswered,
      //     };
      //     axios.post(apiUrl, payload)
      //       .then((response) => {
      //         console.log('Data inserted successfully:', response.data);
      //         navigate("/game-lobby");
      //       })
      //       .catch((error) => {
      //         console.error('Error calling the API:', error);
      //       });
      //   }
      // }, 2000);
      
    }
    setTimeout(() => {
      setShowAnswer(false);
      let nextQuestionIndexToShow = lastQuestionAnsweredRef.current;
      currentQuestionIndexRef.current = (nextQuestionIndexToShow);
      setNextQuestionIndex(nextQuestionIndexToShow + 1);
      setSelectedOption('');
      setTimeRemaining(30);
    }, 2000);
  };


  if (questions.length === 0) {
    return <div>Loading...</div>;
  }


  if (currentQuestionIndexRef.current >= questions.length) {
    return <div>All questions answered!
      {Object.entries(teamScores).map(([team, score]) => (
        <p key={team}>
          Team: {team},
          Score: {score}
        </p>
      ))}
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndexRef.current];

  return (
    <div>
      <div>
        {/* Render current question */}
        <h3>Question {currentQuestionIndexRef.current + 1}</h3>
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
