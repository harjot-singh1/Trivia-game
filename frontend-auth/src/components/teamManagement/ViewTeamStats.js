import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../NavBar";
const ViewTeamStats = () => {
    const currentTeamId = localStorage.getItem("teamId").toString()
    const fetchTeamStatsUrl = "https://us-central1-serverless-391112.cloudfunctions.net/fetch-team-stats";
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" })

    const [winLoss, setWinLoss] = useState([]);
    const [gamesPlayed, setGamesPlayed] = useState([]);
    const [pointsEarned, setPointsEarned] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            console.log(currentMonth)

            const requestBody = {};
            requestBody.team_id = currentTeamId;
            requestBody.stats_month = currentMonth;

            try {
                const fetchStatsResponse = await axios.post(fetchTeamStatsUrl, requestBody);
                const fetchStatsData = fetchStatsResponse.data;
                setWinLoss(fetchStatsData['win_loss']);
                setPointsEarned(fetchStatsData['points_earned']);
                setGamesPlayed(fetchStatsData['games_played']);
            } catch (error) {
                console.error(error);
            }

        }
        fetchStats();
    })

    return (
        <div>
            <NavBar></NavBar>
            <h1>For your current team, here are the stats for the month of {currentMonth}</h1>
            <h2>Games Played: {gamesPlayed}</h2>
            <h2>Win Loss Ratio: {winLoss}</h2>
            <h2>Points Earned: {pointsEarned}</h2>
        </div>
    )
};

export default ViewTeamStats;