import { useState, useEffect } from 'react';
import oversightLogo from '../assets/OversightLogo.png';
import Card from '../components/Card.jsx';
import { IDBStorage, Get, Put, Delete } from '../storage/IDBStorage.js';

function Home() {
    const [fetchError, setFetchError] = useState(null);
    const [games, setGames] = useState([]);
    const [gamesAreLoading, setGamesAreLoading] = useState(false);

    let steamApiKey;

    if (import.meta.env.MODE === "development")
        steamApiKey = "XXXXXX"
    else
        steamApiKey = import.meta.env.REACT_APP_STEAM_API_KEY;

    async function handleGetSteamApps() {

        setGamesAreLoading(true);

        await fetch(`https://api.steampowered.com/IStoreService/GetAppList/v1/?include_games=true&include_dlc=false&include_software=false&include_videos=false&include_hardware=false&key=${steamApiKey}&max_results=5`)
            .then(res => res.json())
            .then(data => {
                const games = data.response.apps.map(appJson => ({
                    id: appJson.appid,
                    name: appJson.name
                }));
                setGames(games);
                setGamesAreLoading(false);
            })
            .catch(error => {
                setFetchError(error);
            })
    }

    function handleGetSteamAppDetails(appId) {

    }

    return (
        <div className='home-container'>
            <div className="logo-container">
                <img src={oversightLogo} className="logo" alt="Oversight Logo" />
            </div>
            <div className="content">
                <h1>Oversight</h1>
                <div className="card">
                    {gamesAreLoading && !fetchError && <i className='fa-circle-o-notch fa-spin' />}
                    {!gamesAreLoading && !fetchError && <button onClick={async () => await handleGetSteamApps()}>
                        Get Games
                    </button>
                    }
                    {!gamesAreLoading && games.length > 0 && games.map(game => (
                        <Card key={game.id} id={game.id} name={game.name} />
                    ))}
                    {fetchError && <p>{fetchError}</p>}
                </div>
            </div>
            <div className="footer">
                <p>Just wait, there's more!</p>
            </div>
        </div>
    )
}

export default Home;