import React, { useEffect, useState } from "react";
import axios from "axios";

const BattlePage = () => {
  const [computerPokemon, setComputerPokemon] = useState(null); // Computer-selected Pokémon
  const [roster, setRoster] = useState([]); // User's roster
  const [selectedPokemon, setSelectedPokemon] = useState(null); // User-selected Pokémon
  const [winner, setWinner] = useState(null); // Battle winner
  const [score, setScore] = useState(0); // User's total score
  const [username, setUsername] = useState(localStorage.getItem("username") || ""); // Player's username

  // Fetch the user's roster on page load
  useEffect(() => {
    axios
      .get("http://localhost:3000/roster")
      .then((response) => {
        setRoster(response.data); // Set the roster
      })
      .catch((error) => {
        console.error("Error fetching roster:", error);
      });
  }, []);

  // Fetch a random Pokémon for the computer
  const fetchComputerPokemon = async () => {
    const randomId = Math.floor(Math.random() * 150) + 1; // Random Pokémon ID (1-150)
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      setComputerPokemon({
        name: response.data.name,
        stats: response.data.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
        image: response.data.sprites.front_default,
      });
    } catch (error) {
      console.error("Error fetching computer Pokémon:", error);
    }
  };

  // Handle the battle logic
  const handleBattle = () => {
    if (!computerPokemon || !selectedPokemon) {
      alert("Both Pokémon must be selected for the battle!");
      return;
    }

    // Calculate total stats
    const computerTotalStats =
    computerPokemon.stats?.reduce((sum, stat) => sum + stat.value, 0) || 0;
    const userTotalStats =
    selectedPokemon.stats?.reduce((sum, stat) => sum + stat.value, 0) || 0;
    // Determine the winner
    if (userTotalStats > computerTotalStats) {
      setWinner(`You win! (${selectedPokemon.name} beats ${computerPokemon.name})`);
      const newScore = score + 10; // Add points for a win
      setScore(newScore);
      updateLeaderboard(newScore);
    } else if (computerTotalStats > userTotalStats) {
      setWinner(`You lose! (${computerPokemon.name} beats ${selectedPokemon.name})`);
    } else {
      setWinner("It's a tie!");
    }
  };

  // Update leaderboard with the new score
  const updateLeaderboard = (newScore) => {
    if (!username) {
      alert("Please set your username to save your score!");
      return;
    }
    axios
      .post("http://localhost:3000/leaderboard", { username, score: newScore })
      .then((response) => {
        console.log("Score updated on leaderboard:", response.data);
      })
      .catch((error) => {
        console.error("Error updating leaderboard:", error);
      });
  };

  // Prompt for username if not already set
  const promptUsername = () => {
    const name = prompt("Enter your username:");
    if (name) {
      setUsername(name);
      localStorage.setItem("username", name);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-center mb-10">Pokémon Battle</h1>

      {/* Username Display */}
      {!username ? (
        <div className="text-center mb-6">
          <button
            onClick={promptUsername}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set Username
          </button>
        </div>
      ) : (
        <p className="text-center text-xl">Player: {username}</p>
      )}

      {/* Computer's Pokémon */}
      {computerPokemon && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Computer's Pokémon</h2>
          <img src={computerPokemon.image} alt={computerPokemon.name} className="mx-auto" />
          <p className="capitalize">{computerPokemon.name}</p>
        </div>
      )}

      {/* User's Roster Selection */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold">Select Your Pokémon</h2>
        <select
          className="mt-4 p-2 border rounded"
          onChange={(e) => {
            const selected = roster.find((pokemon) => pokemon._id === e.target.value);
            setSelectedPokemon(selected);
          }}
        >
          <option value="">-- Select Pokémon --</option>
          {roster.map((pokemon) => (
            <option key={pokemon._id} value={pokemon._id}>
              {pokemon.name}
            </option>
          ))}
        </select>
      </div>

      {/* Battle Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleBattle}
          className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
        >
          Battle!
        </button>
      </div>

      {/* Winner Announcement */}
      {winner && (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold">{winner}</h2>
        </div>
      )}

      {/* Scoreboard */}
      <div className="text-center mt-10">
        <p className="text-xl">Your Score: {score}</p>
      </div>

      {/* Fetch Computer Pokémon */}
      <div className="text-center mt-10">
        <button
          onClick={fetchComputerPokemon}
          className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
        >
          New Battle
        </button>
      </div>
    </div>
  );
};

export default BattlePage;
