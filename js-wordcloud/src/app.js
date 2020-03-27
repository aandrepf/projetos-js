import { WordCloudController } from './controller/WordCloudController';

let words = [
	{
		"Name": "mais",
		"Value": 562.0,
		"Color": "#102a4e"
	},
	{
		"Name": "anuncia",
		"Value": 556.0,
		"Color": "#102a4e"
	},
	{
		"Name": "fechados",
		"Value": 504.0,
		"Color": "#102a4e"
	},
	{
		"Name": "SP",
		"Value": 500.0,
		"Color": "#102a4e"
	},
	{
		"Name": "shoppings",
		"Value": 498.0,
		"Color": "#102a4e"
	},
	{
		"Name": "acesso",
		"Value": 483.0,
		"Color": "#102a4e"
	},
	{
		"Name": "durante",
		"Value": 481.0,
		"Color": "#102a4e"
	},
	{
		"Name": "quarentena",
		"Value": 447.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Doria",
		"Value": 433.0,
		"Color": "#102a4e"
	},
	{
		"Name": "medidas",
		"Value": 431.0,
		"Color": "#102a4e"
	},
	{
		"Name": "bônus",
		"Value": 426.0,
		"Color": "#102a4e"
	},
	{
		"Name": "fechamento",
		"Value": 419.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Casa",
		"Value": 397.0,
		"Color": "#102a4e"
	},
	{
		"Name": "abrem",
		"Value": 390.0,
		"Color": "#102a4e"
	},
	{
		"Name": "assinatura",
		"Value": 388.0,
		"Color": "#102a4e"
	},
	{
		"Name": "COVID-19",
		"Value": 382.0,
		"Color": "#102a4e"
	},
	{
		"Name": "celular",
		"Value": 376.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Metropolitana",
		"Value": 372.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Região",
		"Value": 372.0,
		"Color": "#102a4e"
	},
	{
		"Name": "centers",
		"Value": 370.0,
		"Color": "#102a4e"
	},
	{
		"Name": "serviços",
		"Value": 357.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Streaming",
		"Value": 350.0,
		"Color": "#102a4e"
	},
	{
		"Name": "libera",
		"Value": 347.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Brasil",
		"Value": 346.0,
		"Color": "#102a4e"
	},
	{
		"Name": "COVID",
		"Value": 329.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Nextel",
		"Value": 279.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Telefonia",
		"Value": 276.0,
		"Color": "#b4b4b4"
	},
	{
		"Name": "pandemia",
		"Value": 274.0,
		"Color": "#102a4e"
	},
	{
		"Name": "consumo",
		"Value": 265.0,
		"Color": "#102a4e"
	},
	{
		"Name": "meio",
		"Value": 265.0,
		"Color": "#102a4e"
	},
	{
		"Name": "clientes",
		"Value": 257.0,
		"Color": "#102a4e"
	},
	{
		"Name": "reforçam",
		"Value": 252.0,
		"Color": "#102a4e"
	},
	{
		"Name": "banda",
		"Value": 250.0,
		"Color": "#102a4e"
	},
	{
		"Name": "larga",
		"Value": 242.0,
		"Color": "#102a4e"
	},
	{
		"Name": "aumentam",
		"Value": 236.0,
		"Color": "#102a4e"
	},
	{
		"Name": "dia",
		"Value": 234.0,
		"Color": "#102a4e"
	},
	{
		"Name": "móveis",
		"Value": 230.0,
		"Color": "#102a4e"
	},
	{
		"Name": "Sinais",
		"Value": 228.0,
		"Color": "#102a4e"
	},
	{
		"Name": "ampliam",
		"Value": 219.0,
		"Color": "#102a4e"
	}
];

window.app = new WordCloudController(words);