import React, { useState } from "react";
import useWeatherStore from "./store/weatherStore";

// Компонент иконки погоды
const WeatherIcon = ({ code }) => {
	const getIcon = () => {
		if (code === 0 || code === 1) return "☀️";
		if (code === 2) return "⛅";
		if (code === 3) return "☁️";
		if (code >= 45 && code <= 48) return "🌫️";
		if (code >= 51 && code <= 55) return "🌦️";
		if (code >= 61 && code <= 65) return "🌧️";
		if (code >= 71 && code <= 77) return "❄️";
		if (code >= 80 && code <= 82) return "⛈️";
		if (code >= 85 && code <= 86) return "🌨️";
		if (code >= 95 && code <= 99) return "⚡";
		return "🌤️";
	};

	return <div className="text-8xl mb-4">{getIcon()}</div>;
};

// Компонент карточки с информацией
const InfoCard = ({ icon, label, value, unit }) => (
	<div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 hover:bg-white/30 transition-all">
		<div className="text-3xl">{icon}</div>
		<div>
			<div className="text-sm text-white/80">{label}</div>
			<div className="text-xl font-semibold text-white">
				{value}
				{unit}
			</div>
		</div>
	</div>
);

function App() {
	const [inputCity, setInputCity] = useState("");
	const { weather, loading, error, city, fetchWeather, clearError } =
		useWeatherStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (inputCity.trim()) {
			fetchWeather(inputCity.trim());
		}
	};

	const getBackgroundGradient = () => {
		if (!weather) return "from-blue-400 to-blue-600";

		const code = weather.weatherCode;
		if (code === 0 || code === 1) return "from-yellow-400 to-orange-500";
		if (code >= 61 && code <= 82) return "from-gray-600 to-gray-800";
		if (code >= 71 && code <= 86) return "from-blue-300 to-blue-500";
		if (code >= 95) return "from-purple-600 to-gray-800";
		return "from-blue-400 to-blue-600";
	};

	return (
		<div
			className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 flex items-center justify-center p-4`}
		>
			<div className="max-w-2xl w-full">
				{/* Заголовок */}
				<div className="text-center mb-8 animate-fade-in">
					<h1 className="text-5xl font-bold text-white mb-2">🌤️ Погода</h1>
					<p className="text-white/80">Узнайте погоду в любом городе мира</p>
				</div>

				{/* Форма поиска */}
				<form onSubmit={handleSubmit} className="mb-8 animate-fade-in">
					<div className="flex gap-2">
						<input
							type="text"
							value={inputCity}
							onChange={(e) => setInputCity(e.target.value)}
							placeholder="Введите название города..."
							className="flex-1 px-6 py-4 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading}
							className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "⏳" : "🔍"}
						</button>
					</div>
				</form>

				{/* Ошибка */}
				{error && (
					<div className="mb-8 p-4 bg-red-500/90 backdrop-blur-sm text-white rounded-xl flex items-center justify-between animate-fade-in">
						<span>❌ {error}</span>
						<button
							onClick={clearError}
							className="ml-4 text-white/80 hover:text-white"
						>
							✕
						</button>
					</div>
				)}

				{/* Данные о погоде */}
				{weather && (
					<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl animate-fade-in">
						{/* Основная информация */}
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-white mb-2">{city}</h2>
							<WeatherIcon code={weather.weatherCode} />
							<div className="text-6xl font-bold text-white mb-2">
								{weather.temperature}°C
							</div>
							<div className="text-xl text-white/90 mb-1">
								{weather.description}
							</div>
							<div className="text-lg text-white/70">
								Ощущается как {weather.feelsLike}°C
							</div>
						</div>

						{/* Дополнительная информация */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InfoCard
								icon="💧"
								label="Влажность"
								value={weather.humidity}
								unit="%"
							/>
							<InfoCard
								icon="💨"
								label="Скорость ветра"
								value={weather.windSpeed}
								unit=" км/ч"
							/>
							<InfoCard
								icon="🌧️"
								label="Осадки"
								value={weather.precipitation}
								unit=" мм"
							/>
							<InfoCard
								icon="🕐"
								label="Обновлено"
								value={new Date(weather.timestamp).toLocaleTimeString("ru-RU", {
									hour: "2-digit",
									minute: "2-digit",
								})}
								unit=""
							/>
						</div>
					</div>
				)}

				{/* Начальное сообщение */}
				{!weather && !loading && !error && (
					<div className="text-center text-white/80 animate-fade-in">
						<p className="text-lg">
							👆 Введите название города, чтобы узнать погоду
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
