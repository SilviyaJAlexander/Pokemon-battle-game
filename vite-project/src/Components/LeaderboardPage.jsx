import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const LeaderboardPage = () => {
  const [score, setScore] = useState([]);
  let rank = 1;
  const showScore = JSON.stringify(score);
  useEffect(() => {
    axios
      .get("http://localhost:3000/leaderboard")
      .then((res) => {
        console.log(res.data);
        setScore(res.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {
        <div className="p-10 text-center">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-lg mt-4">
            Check the top players and their scores!
          </p>
          <div className="flex justify-center">
            <div className="card  w-56 shadow-xl mb-6 mt-6">
              {score.map((aScore) => (
                <div key={crypto.randomUUID()} className=" bg-blue-200">
                  <div className=" flex justify-between m-5">
                    {aScore.username}
                    <div />
                    {aScore.score}
                  </div>

                  <p className="p-5"></p>
                </div>
              ))}
            </div>
          </div>
          {/* The button to open modal */}
          <a href="#my_modal" className="btn  btn-accent">
            Add Score
          </a>

          {/* Put this part before </body> tag */}
          <div className="modal" role="dialog" id="my_modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Enter a score</h3>
              <p className="py-4">
                <label className="input input-bordered flex items-center gap-2">
                  Name
                  <input type="text" className="grow" placeholder="" />
                </label>
                <br></br>
                <label className="input input-bordered flex items-center gap-2">
                  Score
                  <input type="text" className="grow" placeholder="" />
                </label>
              </p>
              <div className="modal-action">
                <a href="#" className="btn btn-success">
                  Save
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default LeaderboardPage;
